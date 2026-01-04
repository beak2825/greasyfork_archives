// ==UserScript==
// @name QoI mapper
// @namespace QoI Scripts
// @description Automatischer Mapper fuer QoI
// @match https://www.questofislands.com/*
// @match https://www.barski.org/qoi/karte/map.php*
// @grant GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue
// @grant unsafeWindow
// @version 0.0.2
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/371959/QoI%20mapper.user.js
// @updateURL https://update.greasyfork.org/scripts/371959/QoI%20mapper.meta.js
// ==/UserScript==
//

localStorage.scriptVersion = GM_info.script.version;

var $ = unsafeWindow.$, version = GM_info.script.version;

if(location.href.match(/ingame.php/)) {
    GM_setValue("gameIframed",1);
    setInterval(function() {
        if(GM_getValue("playMusic") == 0) {
            $("audio").detach();
        } else if ($("audio").length == 0) {
            $("iframe").first().before("<audio id='musik' src='mus.mp3' loop autoplay style='visibility:hidden;'></audio>");
            $("audio").attr("volume", "0.05");
        };
    }, 500);
} else if(location.href.match(/map.php/)) {
  //$("#mapperLink").detach();
} else if(location.href.match(/www.questofislands.com\/forum\/$/)
          && $("strong").filter(function(){return $(this).text().match(/^Dieses Board hat keine Foren./);}).length > 0
          && $("a span[itemprop='title']").filter(function(){ return $(this).text().match(/Foren-.*sicht/);}).length > 0) {
    //location.href = $("a span[itemprop='title']").filter(function(){ return $(this).text().match(/Foren-.*sicht/);}).first().closest("a").attr("href");
} else {
  $("head").append("<script src='https://code.jquery.com/jquery-3.3.1.min.js'/>");
  var mapData = [];
  $("form:has(input[name='mmx'])").each(function() {
    var x = $(this).find("[name='mmx']").val(),
        y = $(this).find("[name='mmy']").val(),
        ct = $(this).find("[name='submit']").attr("src");
    if (ct.match(/empty.png/)) {
      ct = $(this).closest("td").attr("background");
    }
    mapData.push({
      "x": x,
      "y": 20000-y,
      "terrain": ct
    })
  });

  if(mapData.length > 0) {
    GM_xmlhttpRequest({
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      url: "https://www.barski.org/qoi/karte/map.php",
      method: "POST",
      data: "map="+encodeURIComponent(JSON.stringify(mapData)),
      onload: function(r) {}
    });
  }
  $(".navbut[href*='nav=map']").closest("td").after('<td align="center"><a class="navbut" id="autokartenlink" href="#">Autokarte</a></td>');
  $("#autokartenlink").click(function(){

    var ap = $(".begintable")[1], w = parseInt($(ap).css("width"))-20, h = parseInt(($(".mapframe").length > 0) ? $(".mapframe").css("height"):$(ap).css("height"))+20, koords = $("th").filter(function(){ return $(this).html().match(/^Aktionen \(/); }).text().match(/([0-9-]+)\/([0-9-]+)/),
        params = "?width="+w+"&height="+h+"&version="+version+(koords ? "&x="+koords[1]+"&y="+koords[2]:"");
    $(ap).html("<tr><td style='padding:0;'><iframe id='automap' src='https://www.barski.org/qoi/karte/map.php"+params+"' width='"+w+"' height='"+h+"' ></iframe></td></tr>");
  });
  if(GM_getValue("playMusic") == 1) {
    unmute();
  } else {
    mute();
  }
}

function mute() {
  if($("#mute").length >0) {
    $("#mute").parent().remove();
  }

  $(".begintable:first a.navbut:last").parent().after("<td align='center'><a href='#' class='navbut' id='unmute'><img height='24px' src='https://www.barski.org/qoi/unmute.png'></img></a></td>")
  $("#unmute").click(unmute);
  GM_setValue("playMusic", 0);
}

function unmute() {
  if($("#unmute").length >0){
    $("#unmute").parent().remove();
  }
  $(".begintable:first a.navbut:last").parent().after("<td align='center'><a href='#' class='navbut' id='mute'><img height='24px'  src='https://www.barski.org/qoi/mute.png'></img></a></td>");
  if(GM_getValue("gameIframed") != 1) {
      $("#mute").after("<audio src='https://www.barski.org/qoi/mus.mp3' loop autoplay></audio>");
      $("audio").attr("volume", "0.05");
  }
  $("#mute").click(mute);
  GM_setValue("playMusic", 1);
}