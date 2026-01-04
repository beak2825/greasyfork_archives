    // ==UserScript==
    // @name		Multitool Gatinho
    // @namespace	Multitool Gatinho
    // @version		0.0.4
    // @author		JoeMan
    // @description  Multitool for the game Grepolis
    // @match        http://*.grepolis.com/*
    // @match        https://*.grepolis.com/*
    // @match        https://code.jquery.com/jquery-3.6.4.min.js
    // @match        https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
    // @match        https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
    // @exclude        https://*.forum.grepolis.com/*
    // @exclude        https://wiki.*.grepolis.com/*
    // @icon		https://i.imgur.com/qYhrH44.gif
    // @license     GPL-3.0
    // @grant    GM_addStyle
    // @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/494070/Multitool%20Gatinho.user.js
// @updateURL https://update.greasyfork.org/scripts/494070/Multitool%20Gatinho.meta.js
    // ==/UserScript==

    var version = '0.0.4';
GM_addStyle ( `
#btnRefresh {
  background-color: #2c3684;
  cursor: pointer;
  border: none;
  border-radius: 3px;
  width: auto;
  position: relative;
  margin: 0 1px;
  line-height: 20px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #fc6;
  text-align: center;
  font-weight: 700;
  padding: 0 10px;
  font-size: 10px;
}
#diciplinas {
  margin-bottom: 3px;
}
#inputfile {
  background-color: #141338;
  cursor: pointer;
  border: none;
  border-radius: 3px;
  width: auto;
  position: relative;
  margin: 0 1px;
    margin-top: 0px;
  line-height: 20px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #fc6;
  text-align: center;
  font-weight: 700;
  padding: 0 10px;
  font-size: 10px;
}
#adicionar-btn, #show-btn, #hide-btn {
  background-color: #132338;
  cursor: pointer;
  border: none;
  border-radius: 3px;
  width: auto;
  position: relative;
  margin: 0 1px;
  line-height: 20px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #fc6;
  text-align: center;
  font-weight: 700;
  padding: 0 10px;
  font-size: 12px;
}
.bloco-de-nota {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}
.titulo-input {
  margin-bottom: 1px;
  width: 20%;
  display: block !important;;
}
.format-btn {
  border: none;
  border-radius: 3px;
  width: auto;
  position: relative;
  margin: 0 1px;
  line-height: 18px;
  color: #fc6;
  text-align: center;
  font-weight: 700;
  padding: 0 5px;
  font-size: 10px;
  background-color: #132338;
}
.format-btn:hover {
    background-image: linear-gradient( 0deg, hsl(220, 1.6%, 63.7%) 0%, hsl(214deg 15% 25%) 20%, hsl(214deg 28% 13%) 40%, hsl(214deg 28% 13%) 60%, hsl(214deg 15% 25%) 80%, hsl(240, 0.7%, 70%) 100% );
}
#adicionar-btn:hover {
    background-image: linear-gradient( 0deg, hsl(220, 1.6%, 63.7%) 0%, hsl(214deg 15% 25%) 20%, hsl(214deg 28% 13%) 40%, hsl(214deg 28% 13%) 60%, hsl(214deg 15% 25%) 80%, hsl(240, 0.7%, 70%) 100% );
}
#show-btn:hover {
    background-image: linear-gradient( 0deg, hsl(220, 1.6%, 63.7%) 0%, hsl(214deg 15% 25%) 20%, hsl(214deg 28% 13%) 40%, hsl(214deg 28% 13%) 60%, hsl(214deg 15% 25%) 80%, hsl(240, 0.7%, 70%) 100% );
}
#hide-btn:hover, #inputfile:hover {
    background-image: linear-gradient( 0deg, hsl(220, 1.6%, 63.7%) 0%, hsl(214deg 15% 25%) 20%, hsl(214deg 28% 13%) 40%, hsl(214deg 28% 13%) 60%, hsl(214deg 15% 25%) 80%, hsl(240, 0.7%, 70%) 100% );
}
.deletar-btn, #clear, .reset-btn, #resetBtgi {
  background-color: #842c2c;
  cursor: pointer;
  border: none;
  border-radius: 3px;
  width: auto;
  position: relative;
  margin: 0 1px;
  line-height: 20px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #fc6;
  text-align: center;
  font-weight: 700;
  padding: 0 10px;
  font-size: 10px;
}
.salvar-btn, .save-file, #activerbouton {
  background-color: #0e6f24;
  cursor: pointer;
  border: none;
  border-radius: 3px;
  width: auto;
  position: relative;
  margin: 0 1px;
  line-height: 20px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #fc6;
  text-align: center;
  font-weight: 700;
  padding: 0 10px;
  font-size: 10px;
  margin-top: 2px;
}
#btnRefresh:hover {
background-image: linear-gradient(0deg,hsl(0deg 0% 80%) 0%,hsl(245deg 20% 69%) 8%,hsl(241deg 28% 58%) 17%,hsl(233deg 42% 45%) 25%,hsl(233deg 44% 41%) 33%,hsl(233deg 47% 38%) 42%,hsl(233deg 50% 35%) 50%,hsl(233deg 47% 38%) 58%,hsl(233deg 44% 41%) 67%,hsl(233deg 42% 45%) 75%,hsl(241deg 28% 58%) 83%,hsl(245deg 20% 69%) 92%,hsl(0deg 0% 80%) 100%);
}
.salvar-btn:hover, .save-file:hover {
    background-image: linear-gradient(0deg,hsl(120deg 2% 80%) 0%,hsl(131deg 14% 49%) 20%,hsl(131deg 42% 32%) 40%,hsl(131deg 42% 32%) 60%,hsl(131deg 14% 49%) 80%,hsl(120deg 2% 80%) 100%);
}
.deletar-btn:hover, #clear:hover, #resetBtgi:hover {
background-image: linear-gradient(0deg,hsl(0deg 0% 81%) 0%,hsl(1deg 15% 50%) 20%,hsl(1deg 37% 38%) 40%,hsl(1deg 37% 38%) 60%,hsl(1deg 15% 50%) 80%,hsl(0deg 0% 81%) 100%);
}
#AC1, #AC2, #AC3, #AC4, #AC5, #AC6, #AC7  {
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  background: transparent url(https://gppt.innogamescdn.com/images/game/border/even.png) repeat scroll 0 0;
}
body {
  background: #eee;
  font-family: Arial;
}
#AB {
  margin: 20px auto;
  overflow-y: scroll;
  scrollbar-color: #2c5284 #2c528478;
  scrollbar-width: thin;
  background-image: url(https://gppt.innogamescdn.com/images/game/border/odd.png);
}
.tab {
  width: auto;
  height: 450px;
}
.tab input[type] {
  display: none;
}
.tab label {
  display: block;
  float: left;
  padding: 12px 20px;
  margin-right: 5px;
  cursor: pointer;
  transition: background-color .3s;
}
.tab label:hover,
.tab input:checked + label {
  background: #2c5284;
  color: #fff;
}
#tib1, #tib2, #tib3, #tib4 {
  background: #0000000d;
}
.tabs {
  clear: both;
  perspective: 400px;
  -webkit-perspective: 400px;
}
.tabs .content {
  background: #fff;
  width: 100%;
  position: absolute;
  border: 2px solid #2c5284;
  padding: 10px 30px 40px;
  line-height: 1.4em;
  opacity: 0;
  transform: rotateX(-20deg);
  transform-origin: top center;
  transition: opacity .3s, transform 1s;
  z-index: 0;
}
#tab1:checked ~ .tabs .content:nth-of-type(1),
#tab2:checked ~ .tabs .content:nth-of-type(2),
#tab3:checked ~ .tabs .content:nth-of-type(3),
#tab4:checked ~ .tabs .content:nth-of-type(4),
#tab5:checked ~ .tabs .content:nth-of-type(5),
#tab6:checked ~ .tabs .content:nth-of-type(6),
#tab7:checked ~ .tabs .content:nth-of-type(7) {
  transform: rotateX(0);
  opacity: 1;
  z-index: 1;
}
#AA1, #AA1, #AA2, #AA3, #AA4, #AA5, #AA6, #AA7, #AA8, #AA9, #AA10, #AA11, #AA12, #BA1, #BA2, #BA3, #BA4, #BA5, #BA6, #BA7, #BA8, #BA9, #BA10, #BA11, #BA12 {
color: #e41528;
text-align: center;
}
#pointsperc, #pointsperc1, #pointsperc2, #pointsperc3, #pointsperc4, #pointCavaleiros2, #pointHop, #pointBigas, #pointArq, #pointCavaleiros, #pointHop2, #pointBigas2 {
color: #e41528;
text-align: center;
}
#nbr1, #nbr2, #nbr3, #nbr4 {
color: #e41528;
}
.hour, .minute, .second, #totalTimeHHMMSS {
color: #2f578c;
}
#calc-output {
  color: #5fae5f;
}
#totalTimeHHMMSS, .hour, .minute, .second {
  background: url(https://gppt.innogamescdn.com/images/game/barracks/input.png) no-repeat;
  border: 0;
  height: 17px;
  padding: 3px;
}
 .titre{
    font-size: 25px;
    font-style: italic;
    font-family: sans-serif;
    color: #0C620C;
  }
  #case{
      height: 37px;
      width: 200px;
      border: 2px solid #2D882D;
      border-radius: 10px;
      background: #ffebbf;
  }
  .numbir{
      height: 50px;
      width: 50px;
      font-size: 25px;
      color: white;
      border: 2px solid #2D882D;
      border-radius: 10px;
      background-color: #5FAE5F;
  }
  .numbir:hover {
    background-color: #0C620C;
  }
  .operator{
      height: 50px;
      width: 50px;
      font-size: 25px;
      color: white;
      border: 2px solid #5FAE5F;
      border-radius: 10px;
      background-color: #9FD29F;
  }
  .operator:hover{
      background-color: #0C620C;
  }
  #pointsgiven, #pointsBigas, #pointsArqueiros, #pointsCavaleiros, #pointsHoplitas {
  color: #fff6e3;
}
` );
    var uw = unsafeWindow || window, $ = uw.jQuery || jQuery, DATA, GM;
    GM = (typeof GM_info === 'object');
    console.log('%c-Grepotemas-Grepolympia- Ready', 'color: green; font-size: 1em; font-weight: bolder; ');
    var dbf_tooltip = "GrepotemasGrepolympia";
    $('.gods_area').append('<div class="btn_settings circle_button dbf_btn" style="top: 90px; right: 3px; z-index: 10;"><div class="dbf_icon js-caption" style="margin: 1px 0px 0px -3px; width: 120px; height: 120px; background: url(https://i.imgur.com/qYhrH44.gif) no-repeat 0px 0px; background-size: 33%"></div></div>');
    $('.dbf_btn').tooltip(dbf_tooltip);
    $('.dbf_btn').on('mousedown', function () {
        $('.dbf_icon').addClass('click');
    });
    $('.dbf_btn').on('mouseup', function () {
       $('.dbf_icon').removeClass('click');
    });
    $('.dbf_btn').click(editDBF);
    $('body').append('<div><div id="dbfwndw" class="ui-dialog ui-widget ui-widget-content ui-corner-all ui-draggable js-window-main-container dbfwndw" tabindex="-1" style="position: absolute; outline: 0px; z-index: 1101; height: auto; width: 800px; top: 96px; left: 124px; display: none;" role="dialog" aria-labelledby="ui-id-6"><div id="drag" class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix"><span id="ui-id-6" class="ui-dialog-title">Gatinho: Ferramentas Grepolis</span><a href="#" class="ui-dialog-titlebar-close ui-corner-all" role="button"><span class="ui-icon ui-icon-closethick" style="margin-left: 31%; width: 50px; height: 20px; border: 1px solid; display: inline-block; position: absolute; background: url(https://gppt.innogamescdn.com/images/game/autogenerated/windows/buttons/buttons_a55d708.png) no-repeat 0 -92px;" ></span></a></div>' +
                     '<div class="gpwindow_frame ui-dialog-content ui-widget-content" style="display: block; width: auto; min-height: 0px; height: 600px;" scrolltop="0" scrollleft="0"><div class="gpwindow_left"></div><div class="gpwindow_right"></div><div class="gpwindow_bottom"><div class="gpwindow_left corner"></div><div class="gpwindow_right corner"></div></div><div class="gpwindow_top"><div class="gpwindow_left corner"></div><div class="gpwindow_right corner"></div></div><div id="gpwnd_1005" style="overflow-x: auto;" class="gpwindow_content"><div class="game_border"><div class="game_border_top"></div><div class="game_border_bottom"></div><div class="game_border_left"></div><div class="game_border_right"></div><div class="game_border_corner corner1"></div><div class="game_border_corner corner2"></div><div class="game_border_corner corner3"></div><div class="game_border_corner corner4"></div><div class="game_header bold" style="height:18px;"><div style="float:left; padding-right:10px;">Multitool Gatinho</div></div>'+

                    '<div id="AB" class="tab">'+
      '<input type="radio" name="tabs" id="tab1" checked>'+
      '<label for="tab1">Grepolympia.H</label>'+

      '<input type="radio" name="tabs" id="tab2">'+
     ' <label for="tab2">Grepolympia</label>'+

      '<input type="radio" name="tabs" id="tab3">'+
      '<label for="tab3">Pandora</label>'+

      '<input type="radio" name="tabs" id="tab4">'+
      '<label for="tab4">Calcular NC</label>'+

      '<input type="radio" name="tabs" id="tab5">'+
      '<label for="tab5">Cal.Horas</label>'+

      '<input type="radio" name="tabs" id="tab6">'+
      '<label for="tab6">Notas</label>'+

      '<input type="radio" name="tabs" id="tab7">'+
      '<label for="tab7">Calculadora</label>'+

      '<div class="tabs">'+
        '<div id="AC1" class="content">'+
          '<h1 style="color: #2c5284;">Grepolympia de inverno</h1><center><img style="width: 38%;"src="https://wiki.pt.grepolis.com/images/6/62/Winter_grepolympia_wiki_logo.png"></center><div id="numbers"></div>'+
                     '<center>'+
                     '<input size="32" id="TotalUnit" style="color: #406691; font-weight: 700; width: 230px;" value="Distribution of points" disabled/><input size="2" class="skillPoints" id="skillPoints" style="color: #406691; font-weight: 700; width: 24px; text-align: center;" value="0" /><input size="2" id="Pop1" style="display: none;" value="" disabled/><br>'+
                     '<p id="diciplinas" style="color: #406691; font-weight: 700; width: 230px;"> Bobsledge </p><input size="32" id="Speed" value="Balance" disabled/><input style="display: none;" size="2" id="pointsgiven1" value="76%" disabled/><input size="2" id="AA1" disabled/><br/><input size="32" id="Force" value="Control" disabled/><input style="display: none;" size="2" id="pointsgiven2" value="12%" disabled/><input size="2" id="AA2" disabled/><br/><input size="32" id="Resistance" value="Speed" disabled/><input style="display: none;" size="2" id="pointsgiven3" value="12%" disabled/><input size="2" id="AA3" disabled/><br>'+
                     '<p id="diciplinas" style="color: #406691; font-weight: 700; width: 230px;"> Biathlon </p><input size="32" id="Resistance" value="Resistance" disabled/><input style="display: none;" size="2" id="pointsgiven4" value="10%" disabled/><input size="2" id="AA4" disabled/><br/><input size="32" id="Speed" value="Speed" disabled/><input style="display: none;" size="2" id="pointsgiven5" value="80%" disabled/><input size="2" id="AA5" disabled/><br/><input size="32" id="Precision" value="Precision" disabled/><input style="display: none;" size="2" id="pointsgiven6" value="10%" disabled/><input size="2" id="AA6" disabled/><br>' +
                     '<p id="diciplinas" style="color: #406691; font-weight: 700; width: 230px;"> Figure Skating </p><input size="32" id="Technique" value="Technique" disabled/><input style="display: none;" size="2" id="pointsgiven7" value="12%" disabled/><input size="2" id="AA7" disabled/><br/><input size="32" id="Performance" value="Performance" disabled/><input style="display: none;" size="2" id="pointsgiven8" value="9%" disabled/><input size="2" id="AA8" disabled/><br/><input size="32" id="Balance" value="Balance" disabled/><input style="display: none;" size="2" id="pointsgiven9" value="79%" disabled/><input size="2" id="AA9" disabled/><br>'+
                     '<p id="diciplinas" style="color: #406691; font-weight: 700; width: 230px;"> Ski Jumping  </p><input size="32" id="Speed" value="Speed" disabled/><input style="display: none;" size="2" id="pointsgiven10" value="72%" disabled/><input size="2" id="AA10" disabled/><br/><input size="32" id="Focus" value="Focus" disabled/><input style="display: none;" size="2" id="pointsgiven11" value="5%" disabled/><input size="2" id="AA11" disabled/><br/><input size="32" id="Technique" value="Technique" disabled/><input style="display: none;" size="2" id="pointsgiven12" value="23%" disabled/><input size="2" id="AA12" disabled/><br/>'+
   '<div class="form-group mt-2">'+
    '<a id="resetBtgh" class="button" href="#">'+
        '<span class="left"><span class="right"><span class="middle">Reset</span></span></span>'+
        '<span style="clear:both;"></span>'+
    '</a>'+
'</div>'+
                     '</center>'+
                     ' </div>'+

        '<div id="AC2" class="content">'+
          '<h1 style="color: #2c5284;">Grepolympia</h1><center><img style="width: 38%;"src="https://wiki.pt.grepolis.com/images/9/98/Grepolympia.png"></center>'+
                     '<center>'+
                     '<input size="32" id="TotalUnit" style="color: #406691; font-weight: 700; width: 230px;" value="Distribution of points" disabled/><input size="2" class="skillPointsh" id="skillPointsh" style="color: #406691; font-weight: 700; width: 24px; text-align: center;" value="0" /><input size="2" id="Pop1" style="display: none;" value="" disabled/><br>'+
                     '<p id="diciplinas" style="color: #406691; font-weight: 700; width: 230px;"> Bobsledge </p><input size="32" id="Speed" value="Balance" disabled/><input style="display: none;" size="2" id="pointsgiven11" value="76%" disabled/><input size="2" id="BA1" disabled/><br/><input size="32" id="Force" value="Control" disabled/><input style="display: none;" size="2" id="pointsgiven21" value="12%" disabled/><input size="2" id="BA2" disabled/><br/><input size="32" id="Resistance" value="Speed" disabled/><input style="display: none;" size="2" id="pointsgiven31" value="12%" disabled/><input size="2" id="BA3" disabled/><br>'+
                     '<p id="diciplinas" style="color: #406691; font-weight: 700; width: 230px;"> Biathlon </p><input size="32" id="Resistance" value="Resistance" disabled/><input style="display: none;" size="2" id="pointsgiven41" value="10%" disabled/><input size="2" id="BA4" disabled/><br/><input size="32" id="Speed" value="Speed" disabled/><input style="display: none;" size="2" id="pointsgiven51" value="80%" disabled/><input size="2" id="BA5" disabled/><br/><input size="32" id="Precision" value="Precision" disabled/><input style="display: none;" size="2" id="pointsgiven61" value="10%" disabled/><input size="2" id="BA6" disabled/><br>' +
                     '<p id="diciplinas" style="color: #406691; font-weight: 700; width: 230px;"> Figure Skating </p><input size="32" id="Technique" value="Technique" disabled/><input style="display: none;" size="2" id="pointsgiven71" value="12%" disabled/><input size="2" id="BA7" disabled/><br/><input size="32" id="Performance" value="Performance" disabled/><input style="display: none;" size="2" id="pointsgiven81" value="9%" disabled/><input size="2" id="BA8" disabled/><br/><input size="32" id="Balance" value="Balance" disabled/><input style="display: none;" size="2" id="pointsgiven91" value="79%" disabled/><input size="2" id="BA9" disabled/><br>'+
                     '<p id="diciplinas" style="color: #406691; font-weight: 700; width: 230px;"> Ski Jumping  </p><input size="32" id="Speed" value="Speed" disabled/><input style="display: none;" size="2" id="pointsgiven101" value="72%" disabled/><input size="2" id="BA10" disabled/><br/><input size="32" id="Focus" value="Focus" disabled/><input style="display: none;" size="2" id="pointsgiven111" value="5%" disabled/><input size="2" id="BA11" disabled/><br/><input size="32" id="Technique" value="Technique" disabled/><input style="display: none;" size="2" id="pointsgiven121" value="23%" disabled/><input size="2" id="BA12" disabled/><br>'+
   '<div class="form-group mt-2">'+
    '<a id="resetBtg" class="button" href="#">'+
        '<span class="left"><span class="right"><span class="middle">Reset</span></span></span>'+
        '<span style="clear:both;"></span>'+
    '</a>'+
'</div>'+
                     '</center>'+
                     ' </div>'+

       ' <div id="AC3" class="content">'+
         ' <h1 style="color: #2c5284;">Caixa de Pandora</h1><center><img style="width: 38%;"src="https://wiki.pt.grepolis.com/images/1/11/Pandoras_Box_logo.png?20171028210109"></center>'+
          '<center id="imf">'+
'<input size="12" id="TotalUnit" value="Total Unidades" disabled="">'+
'<input size="2" style="text-align: center;" id="pointspossible">'+
'<input size="12" id="nul" value="" disabled="">'+
'<input size="2" id="Pop1" value="Pop" disabled="">'+
'<input size="2" id="nul1" value="" disabled="">'+
'<input size="12" id="nul2" value="" disabled="">'+
'<input size="2" id="Pop2" value="Pop" disabled="">'+
'<br>'+
'<input size="12" id="Keres" value="Keres" disabled="">'+
'<input size="2" id="pointsgiven" value="50%" disabled="">'+
'<input size="12" id="Fondibulario" value="Fondibulario" disabled="">'+
'<input size="2" id="pointsperc" disabled="">'+
'<input size="2" id="pointsHoplitas" value="50%" disabled="">'+
'<input size="12" id="Hoplitas" value="Hoplitas" disabled="">'+
'<input size="2" id="pointHop" disabled="">'+
'<br>'+
'<input size="12" id="Thrasus" value="Thrasus" disabled="">'+
'<input size="2" id="pointsgiven" value="50%" disabled="">'+
'<input size="12" id="Fondibulario" value="Fondibulario" disabled="">'+
'<input size="2" id="pointsperc1" disabled="">'+
'<input size="2" id="pointsBigas" value="50%" disabled="">'+
'<input size="12" id="Bigas" value="Bigas" disabled="">'+
'<input size="2" id="pointBigas" disabled="">'+
'<br>'+
'<input size="12" id="Ascálafo" value="Ascálafo" disabled="">'+
'<input size="2" id="pointsgiven" value="50%" disabled="">'+
'<input size="12" id="Espadachim" value="Espadachim" disabled="">'+
'<input size="2" id="pointsperc2" disabled="">'+
'<input size="2" id="pointsArqueiros" value="50%" disabled="">'+
'<input size="12" id="Arqueiros" value="Arqueiros" disabled="">'+
'<input size="2" id="pointArq" disabled="">'+
'<br>'+
'<input size="12" id="Kakodaimones" value="Kakodaimones" disabled="">'+
'<input size="2" id="pointsgiven" value="50%" disabled="">'+
'<input size="12" id="Fondibulario" value="Fondibulario" disabled="">'+
'<input size="2" id="pointsperc3" disabled="">'+
'<input size="2" id="pointsCavaleiros" value="50%" disabled="">'+
'<input size="12" id="Cavaleiros" value="Cavaleiros" disabled="">'+
'<input size="2" id="pointCavaleiros" disabled="">'+
'<br>'+
'<input size="12" id="Taraxippoi" value="Taraxippoi" disabled="">'+
'<input size="2" id="pointsgiven" value="50%" disabled="">'+
'<input size="12" id="Arqueiros" value="Arqueiros" disabled="">'+
'<input size="2" id="pointsperc4" disabled="">'+
'<input size="2" id="pointsHoplitas" value="50%" disabled="">'+
'<input size="12" id="Hoplitas" value="Hoplitas" disabled="">'+
'<input size="2" id="pointHop2" disabled="">'+
'<br>'+
'<input size="12" id="Proseous" value="Proseous" disabled="">'+
'<input size="2" id="pointsgiven" value="50%" disabled="">'+
'<input size="12" id="Cavaleiros" value="Cavaleiros" disabled="">'+
'<input size="2" id="pointCavaleiros2" disabled="">'+
'<input size="2" id="pointsBigas" value="50%" disabled="">'+
'<input size="12" id="Bigas" value="Bigas" disabled="">'+
'<input size="2" id="pointBigas2" disabled="">'+
    '<br><br>'+
   '<div class="form-group mt-2">'+
    '<a id="resetBtp" class="button" href="#">'+
        '<span class="left"><span class="right"><span class="middle">Reset</span></span></span>'+
        '<span style="clear:both;"></span>'+
    '</a>'+
'</div>'+
'</center>'+

        '</div>'+
        '<div id="AC4" class="content">'+
          '<h2 style="color: #2c5284;">Cálcular a quantidade maxima de navios de escolta.</h2><img src="https://wiki.pt.grepolis.com/images/4/48/P4.png" style="width: 5%;" alt="Hydras" id="hidra" class="Hydras">'+
                               '<center>'+
                     '<h4>Protege o ceu NC contra o feitiço => ( tempestade no mar )</h4>'+
'<h4>A Tempestade no mar destroi entre 10-30% dos navios alvo.</h4>'+
'<h3>Calculadora anti-tempestade</h3>'+
                     '<p>O valor calculado de todos os navios nao deve passar acima dos <font color="#910000">(170)</font></p>'+
            '<table>'+
      '<thead>'+
        '<tr>'+
          '<th>Navio</th>'+
          '<th>Valor</th>'+
        '</tr>'+
      '</thead>'+
      '<tfoot>'+
        '<tr>'+
          '<td><button style="width: 40px; height: 38px;font-size: 8px; background: #e8f5e2;" onclick="somme()">Calcular</button></td>'+
          '<td><input id="sum" name="Trirremes" style="width: 32px; height: 32px; text-align: center; color: rgb(0, 128, 0); font-weight: bold;"/></td>'+
        '</tr>'+
      '</tfoot>'+
      '<tfoot>'+
        '<tr>'+
          '<td><img class="Colonizador" src="https://grmh.pl/i.php?v=sg" alt="Colonizador"/></td>'+
          '<td><input id="nbr5" name="Colon" style="width: 40px; height: 37px; text-align:center; background: #e9e9ed; display: block;margin-top: -3px;" type="submit" value="1"/></td>'+
        '</tr>'+
      '</tfoot>'+
      '<tfoot>'+
        '<tr>'+
          '<td><img class="Hydras" src="https://grmh.pl/i.php?v=gd" alt="Hydras"/></td>'+
          '<td><input id="nbr1" name="Hydras" style="width: 32px; height: 32px; text-align:center;margin-top: -5px;"/></td>'+
        '</tr>'+
      '</tfoot>'+
      '<tfoot>'+
        '<tr>'+
          '<td><img class="Farois" src="https://grmh.pl/i.php?v=sc" alt="Farois"/></td>'+
          '<td><input id="nbr2" name="Farois" style="width: 32px; height: 32px; text-align:center;margin-top: -5px;"/></td>'+
        '</tr>'+
      '</tfoot>'+
      '<tfoot>'+
        '<tr>'+
          '<td><img class="Birremes" src="https://grmh.pl/i.php?v=sb" alt="Birremes"/></td>'+
          '<td><input id="nbr3" name="Birremes" style="width: 32px; height: 32px; text-align:center;margin-top: -5px;"/></td>'+
        '</tr>'+
      '</tfoot>'+
      '<tfoot>'+
        '<tr>'+
          '<td><img class="Trirremes" src="https://grmh.pl/i.php?v=sf" alt="Trirremes"/></td>'+
          '<td><input id="nbr4" name="Trirremes" style="width: 32px; height: 32px; text-align:center;margin-top: -5px;"/></td>'+
        '</tr>'+
      '</tfoot>'+
    '</table>'+
'<div><h4 id="Tposi" style="display: inline-block; margin-left: 50px;" type="text" value="Mickey"></h4>&nbsp;&nbsp;&nbsp;&nbsp;'+
'<img id="Posidon" style="width: 5%;" class="Hydras" src="https://wiki.pt.grepolis.com/images/4/48/P4.png" alt="Hydras"/>'+
'</div>'+
  '<div class="form-group mt-2">'+
    '<a id="resetBtc" class="button" href="#">'+
        '<span class="left"><span class="right"><span class="middle">Reset</span></span></span>'+
        '<span style="clear:both;"></span>'+
    '</a>'+
'</div>'+
'</center>'+
        ' </div>'+

                 '<div id="AC5" class="content">'+
          '<h1 style="color: #2c5284;">Calculadora de horas</h1><center><img style="width: 38%;"src="https://wiki.fr.grepolis.com/images/4/41/OlympusWikiBanner.png"></center>'+
                     '<svg style="width: 85px;transform: rotate(20deg); right: 450px; position: absolute; top: 80px; z-index: -5;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" viewBox="0 0 422.32 422.32" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="_x34_2._Calculator_1_"> <g id="XMLID_90_"> <g> <g> <path style="fill:#FF7124;" d="M385.68,121.69v275.63c0,8.28-6.72,15-15,15H269.33v-0.93V266.98V122.57v-0.88H385.68z"></path> </g> <g> <path style="fill:#8ECAC1;" d="M385.68,25v96.69H269.33H152.99H36.64V25c0-8.28,6.72-15,15-15h319.04 C378.96,10,385.68,16.72,385.68,25z"></path> </g> <g> <path style="fill:#E6B263;" d="M269.33,411.39v0.93H152.99v-0.93V266.98H268.6h0.73V411.39z M238.83,358.82 c0-4.71-3.82-8.53-8.53-8.53c-4.71,0-8.53,3.82-8.53,8.53c0,4.71,3.82,8.53,8.53,8.53 C235.01,367.35,238.83,363.53,238.83,358.82z M200.54,320.53c0-4.71-3.81-8.53-8.53-8.53c-4.71,0-8.52,3.82-8.52,8.53 c0,4.71,3.81,8.53,8.52,8.53C196.73,329.06,200.54,325.24,200.54,320.53z"></path> </g> <g> <polygon style="fill:#F2D59F;" points="269.33,122.57 269.33,266.98 268.6,266.98 152.99,266.98 152.99,122.57 152.99,121.69 269.33,121.69 "></polygon> </g> <g> <circle style="fill:#5E2A41;" cx="230.3" cy="358.82" r="8.53"></circle> </g> <g> <path style="fill:#5E2A41;" d="M192.01,312c4.72,0,8.53,3.82,8.53,8.53c0,4.71-3.81,8.53-8.53,8.53c-4.71,0-8.52-3.82-8.52-8.53 C183.49,315.82,187.3,312,192.01,312z"></path> </g> <g> <path style="fill:#F2D59F;" d="M152.99,411.39v0.93H51.64c-8.28,0-15-6.72-15-15V266.98h0.73h115.62V411.39z"></path> </g> <g> <polygon style="fill:#E6B263;" points="152.99,122.57 152.99,266.98 37.37,266.98 36.64,266.98 36.64,121.69 152.99,121.69 "></polygon> </g> </g> <g> <g> <path style="fill:#5E2A41;" d="M370.68,422.32H51.64c-13.785,0-25-11.215-25-25V25c0-13.785,11.215-25,25-25h319.04 c13.785,0,25,11.215,25,25v372.32C395.68,411.105,384.465,422.32,370.68,422.32z M51.64,20c-2.757,0-5,2.243-5,5v372.32 c0,2.757,2.243,5,5,5h319.04c2.757,0,5-2.243,5-5V25c0-2.757-2.243-5-5-5H51.64z"></path> </g> <g> <path style="fill:#5E2A41;" d="M385.68,131.69H36.64c-5.523,0-10-4.477-10-10c0-5.523,4.477-10,10-10h349.04 c5.523,0,10,4.477,10,10C395.68,127.213,391.203,131.69,385.68,131.69z"></path> </g> <g> <path style="fill:#5E2A41;" d="M269.33,421.39c-5.523,0-10-4.477-10-10V122.57c0-5.523,4.477-10,10-10c5.523,0,10,4.477,10,10 v288.82C279.33,416.913,274.853,421.39,269.33,421.39z"></path> </g> <g> <path style="fill:#5E2A41;" d="M268.6,276.98H37.37c-5.523,0-10-4.477-10-10c0-5.523,4.477-10,10-10H268.6 c5.523,0,10,4.477,10,10C278.6,272.503,274.123,276.98,268.6,276.98z"></path> </g> <g> <path style="fill:#5E2A41;" d="M119.54,204.34H70.09c-5.523,0-10-4.477-10-10c0-5.523,4.477-10,10-10h49.45 c5.523,0,10,4.477,10,10C129.54,199.863,125.063,204.34,119.54,204.34z"></path> </g> <g> <path style="fill:#5E2A41;" d="M94.82,229.06c-5.523,0-10-4.477-10-10v-49.45c0-5.523,4.477-10,10-10c5.523,0,10,4.477,10,10 v49.45C104.82,224.583,100.343,229.06,94.82,229.06z"></path> </g> <g> <path style="fill:#5E2A41;" d="M236.38,204.34h-50.44c-5.523,0-10-4.477-10-10c0-5.523,4.477-10,10-10h50.44 c5.523,0,10,4.477,10,10C246.38,199.863,241.903,204.34,236.38,204.34z"></path> </g> <g> <path style="fill:#5E2A41;" d="M113.96,368.82c-2.56,0-5.118-0.976-7.071-2.929l-38.289-38.29 c-3.905-3.905-3.906-10.237-0.001-14.142c3.905-3.905,10.237-3.906,14.142,0l38.29,38.29c3.905,3.905,3.905,10.237,0,14.142 C119.078,367.843,116.519,368.82,113.96,368.82z"></path> </g> <g> <path style="fill:#5E2A41;" d="M75.67,368.82c-2.56,0-5.12-0.977-7.073-2.931c-3.904-3.906-3.903-10.238,0.003-14.142 l38.287-38.287c3.903-3.907,10.235-3.908,14.142-0.003c3.906,3.904,3.908,10.236,0.004,14.142l-38.294,38.293 C80.786,367.844,78.228,368.82,75.67,368.82z"></path> </g> <g> <path style="fill:#5E2A41;" d="M192.01,368.82c-2.559,0-5.119-0.976-7.071-2.929c-3.905-3.905-3.905-10.237,0-14.142 l38.29-38.29c3.905-3.905,10.237-3.905,14.143,0c3.905,3.905,3.905,10.237,0,14.143l-38.29,38.29 C197.129,367.844,194.569,368.82,192.01,368.82z"></path> </g> <g> <path style="fill:#5E2A41;" d="M352.77,259.55h-51.11c-5.523,0-10-4.477-10-10c0-5.523,4.477-10,10-10h51.11 c5.523,0,10,4.477,10,10C362.77,255.073,358.293,259.55,352.77,259.55z"></path> </g> <g> <path style="fill:#5E2A41;" d="M352.77,294.46h-51.11c-5.523,0-10-4.477-10-10c0-5.523,4.477-10,10-10h51.11 c5.523,0,10,4.477,10,10C362.77,289.983,358.293,294.46,352.77,294.46z"></path> </g> <g> <path style="fill:#5E2A41;" d="M152.99,421.39c-5.523,0-10-4.477-10-10V122.57c0-5.523,4.477-10,10-10c5.523,0,10,4.477,10,10 v288.82C162.99,416.913,158.513,421.39,152.99,421.39z"></path> </g> </g> </g> </g> </g></svg>'+
                     '<br/>'+
                     '<div><h4>Esta calculadora permite efetuar a soma entre dois horários.</h4></div>'+
                     '<br/>'+
                     '<table id="timeTable" class="table table-bordered">'+
    '<tbody>'+
        '<tr>'+
            '<td><strong>horas</strong></td>'+
            '<td><strong>minutos</strong></td>'+
            '<td><strong>segundos</strong></td>'+
            '<td style="border:0">&nbsp;</td>'+
        '</tr>'+

        '<tr>'+
            '<td><input style="width: 55px;text-align: center;" min="0" max="23" placeholder="HH" class="hour" maxlength="2"></td>'+
            '<td><input style="width: 55px;text-align: center;" min="0" max="59" placeholder="MM" class="minute" maxlength="2"></td>'+
            '<td><input style="width: 55px;text-align: center;" min="0" max="59" placeholder="SS" class="second" maxlength="2"></td>'+
        '</tr>'+

        '<tr>'+
           '<td><input style="width: 55px;text-align: center;" min="0" max="23" placeholder="HH" class="hour" maxlength="2"></td>'+
            '<td><input style="width: 55px;text-align: center;" min="0" max="59" placeholder="MM" class="minute" maxlength="2"></td>'+
            '<td><input style="width: 55px;text-align: center;" min="0" max="59" placeholder="SS" class="second" maxlength="2"></td>'+
        '</tr>'+

    '</tbody>'+
'</table>'+

'<table id="timeTable2" class="table table-bordered">'+
  '<tbody><tr><td><input id="totalTimeHHMMSS" style="font-size: 10px; font-weight: bold;" placeholder="Resultado" class="Total"></td></tr>'+
'</tbody>'+
  '</table>'+

'<div class="form-group mt-2">'+
                     '<a id="calcularSomaBtn" class="button" href="#" onclick="calcularSoma();">'+
        '<span class="left"><span class="right"><span class="middle">Calcular horas</span></span></span>'+
        '<span style="clear:both;"></span>'+
    '</a>'+
   '</div>'+

'<div class="form-group mt-2">'+
    '<a id="copiarBtn" class="button" href="#">'+
        '<span class="left"><span class="right"><span class="middle">Copiar horas</span></span></span>'+
        '<span style="clear:both;"></span>'+
    '</a>'+
'</div>'+

  '<div class="form-group mt-2">'+
    '<a id="resetBtn" class="button" href="#">'+
        '<span class="left"><span class="right"><span class="middle">Reset</span></span></span>'+
        '<span style="clear:both;"></span>'+
    '</a>'+
'</div>'+

'</div>'+
                            '<div id="AC6" class="content">'+
          '<h1 style="color: #2c5284;">Bloco de nota</h1><center><img style="width: 38%;"src="https://wiki.fr.grepolis.com/images/4/41/OlympusWikiBanner.png"></center>'+
                     '<img src="https://cdn.icon-icons.com/icons2/74/PNG/256/bloc_notes_14535.png" style="width: 15%;transform: rotate(-20deg); right: 460px; position: absolute; top: 60px; z-index: -1;" alt="notas" id="notas" class="notas">'+
                     '<h3 style="color: #2c5284; text-shadow: #2c528445 1px 1px 0;">1- Criar una nova anotação, pode ser salva no formato (.txt) em (Downloads) local.</h3>'+
                         '<button id="adicionar-btn">Adicionar Bloco de Nota</button>'+
                         '<br><br>'+
                         '<div class="containers">'+
                         '</div>'+
                    '<h3 style="color: #2c5284; text-shadow: #2c528445 1px 1px 0;">2- Modificar uma anotação (.txt*) salva em (Downloads) local.</h3>'+
                        '<button id="show-btn">Mostrar bloco de nota</button><button id="hide-btn">Ocultar bloco de nota</button>'+
                     '<br>'+
                        '<div  style="display: none" class="hideshow">'+
                                          '<br>'+
                     '<div id="Important" style="background: #ccf3ff85;"><svg style="width: 20px;" viewBox="0 0 200 200" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><style>.cls-1{fill:#ffffff;}.cls-2{fill:#ffc861;}.cls-3{fill:#2f4360;}.cls-4{fill:none;stroke:#2f4360;stroke-linecap:round;stroke-linejoin:round;stroke-width:6px;}</style></defs><title></title><path class="cls-1" d="M180.77,164a11.28,11.28,0,0,1-10.82,8H30a11.33,11.33,0,0,1-9.81-17l70-121.16a11.32,11.32,0,0,1,19.62,0l70,121.16A11.15,11.15,0,0,1,180.77,164Z"></path><path class="cls-2" d="M180.77,164H36.07c-8.72,0-5.17-9.44-.81-17l68.3-118.3a11.2,11.2,0,0,1,6.25,5.1l70,121.16A11.15,11.15,0,0,1,180.77,164Z"></path><path class="cls-3" d="M101.69,139.57q-2.92-.07-5.84,0A4.72,4.72,0,0,1,91,135.15l-3.7-58.79a4.74,4.74,0,0,1,4.55-5q6.9-.25,13.81,0a4.74,4.74,0,0,1,4.55,5l-3.7,58.79A4.72,4.72,0,0,1,101.69,139.57Z"></path><path class="cls-3" d="M105.62,149.69a6.88,6.88,0,0,1-13.69,0c-0.27-3.54,2.8-6.66,6.84-6.66S105.88,146.15,105.62,149.69Z"></path><path class="cls-4" d="M20.23,154.92l70-121.16a11.33,11.33,0,0,1,19.63,0l70,121.16a11.33,11.33,0,0,1-9.81,17H30A11.33,11.33,0,0,1,20.23,154.92Z"></path></g></svg><span style="color: #842c2c; font-weight: 700; font-size: 16px; position: absolute; margin-top: 3px;">Importante</span><br>Enfrentam um problema para carregar um arquivo em uma pasta Local?<br>É imperativo salvar seu trabalho antes de seguir a próxima etapa.<br>Para solucionar o problema clique no botao (Refresh page).</div>'+
                                          '<br>'+
                        '<input style="display: block; margin-top: 2px;"class="select-zone" type="file" name="inputfile" id="inputfile">'+
                       '<textarea cols="99" rows="10" id="output"></textarea>'+
                       '<button class="save-file">Salvar</button>'+
                      '<button  value="Clear" id="clear">Redefinir texto</button>'+
                     '<button  value="Clear" id="resetBtgi">Redefinir nome do arquivo</button>'+
                     '<button id="btnRefresh" type="button">Atualizar a página</button>'+
                   '</div>'+
                     ' </div>'+
      '<div id="AC7" class="content">'+
          '<h1 style="color: #2c5284;">Calculadora</h1>'+
     '<svg style="width: 85px;transform: rotate(20deg); right: 500px; position: absolute; top: 60px; z-index: -5;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" viewBox="0 0 422.32 422.32" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="_x34_2._Calculator_1_"> <g id="XMLID_90_"> <g> <g> <path style="fill:#FF7124;" d="M385.68,121.69v275.63c0,8.28-6.72,15-15,15H269.33v-0.93V266.98V122.57v-0.88H385.68z"></path> </g> <g> <path style="fill:#8ECAC1;" d="M385.68,25v96.69H269.33H152.99H36.64V25c0-8.28,6.72-15,15-15h319.04 C378.96,10,385.68,16.72,385.68,25z"></path> </g> <g> <path style="fill:#E6B263;" d="M269.33,411.39v0.93H152.99v-0.93V266.98H268.6h0.73V411.39z M238.83,358.82 c0-4.71-3.82-8.53-8.53-8.53c-4.71,0-8.53,3.82-8.53,8.53c0,4.71,3.82,8.53,8.53,8.53 C235.01,367.35,238.83,363.53,238.83,358.82z M200.54,320.53c0-4.71-3.81-8.53-8.53-8.53c-4.71,0-8.52,3.82-8.52,8.53 c0,4.71,3.81,8.53,8.52,8.53C196.73,329.06,200.54,325.24,200.54,320.53z"></path> </g> <g> <polygon style="fill:#F2D59F;" points="269.33,122.57 269.33,266.98 268.6,266.98 152.99,266.98 152.99,122.57 152.99,121.69 269.33,121.69 "></polygon> </g> <g> <circle style="fill:#5E2A41;" cx="230.3" cy="358.82" r="8.53"></circle> </g> <g> <path style="fill:#5E2A41;" d="M192.01,312c4.72,0,8.53,3.82,8.53,8.53c0,4.71-3.81,8.53-8.53,8.53c-4.71,0-8.52-3.82-8.52-8.53 C183.49,315.82,187.3,312,192.01,312z"></path> </g> <g> <path style="fill:#F2D59F;" d="M152.99,411.39v0.93H51.64c-8.28,0-15-6.72-15-15V266.98h0.73h115.62V411.39z"></path> </g> <g> <polygon style="fill:#E6B263;" points="152.99,122.57 152.99,266.98 37.37,266.98 36.64,266.98 36.64,121.69 152.99,121.69 "></polygon> </g> </g> <g> <g> <path style="fill:#5E2A41;" d="M370.68,422.32H51.64c-13.785,0-25-11.215-25-25V25c0-13.785,11.215-25,25-25h319.04 c13.785,0,25,11.215,25,25v372.32C395.68,411.105,384.465,422.32,370.68,422.32z M51.64,20c-2.757,0-5,2.243-5,5v372.32 c0,2.757,2.243,5,5,5h319.04c2.757,0,5-2.243,5-5V25c0-2.757-2.243-5-5-5H51.64z"></path> </g> <g> <path style="fill:#5E2A41;" d="M385.68,131.69H36.64c-5.523,0-10-4.477-10-10c0-5.523,4.477-10,10-10h349.04 c5.523,0,10,4.477,10,10C395.68,127.213,391.203,131.69,385.68,131.69z"></path> </g> <g> <path style="fill:#5E2A41;" d="M269.33,421.39c-5.523,0-10-4.477-10-10V122.57c0-5.523,4.477-10,10-10c5.523,0,10,4.477,10,10 v288.82C279.33,416.913,274.853,421.39,269.33,421.39z"></path> </g> <g> <path style="fill:#5E2A41;" d="M268.6,276.98H37.37c-5.523,0-10-4.477-10-10c0-5.523,4.477-10,10-10H268.6 c5.523,0,10,4.477,10,10C278.6,272.503,274.123,276.98,268.6,276.98z"></path> </g> <g> <path style="fill:#5E2A41;" d="M119.54,204.34H70.09c-5.523,0-10-4.477-10-10c0-5.523,4.477-10,10-10h49.45 c5.523,0,10,4.477,10,10C129.54,199.863,125.063,204.34,119.54,204.34z"></path> </g> <g> <path style="fill:#5E2A41;" d="M94.82,229.06c-5.523,0-10-4.477-10-10v-49.45c0-5.523,4.477-10,10-10c5.523,0,10,4.477,10,10 v49.45C104.82,224.583,100.343,229.06,94.82,229.06z"></path> </g> <g> <path style="fill:#5E2A41;" d="M236.38,204.34h-50.44c-5.523,0-10-4.477-10-10c0-5.523,4.477-10,10-10h50.44 c5.523,0,10,4.477,10,10C246.38,199.863,241.903,204.34,236.38,204.34z"></path> </g> <g> <path style="fill:#5E2A41;" d="M113.96,368.82c-2.56,0-5.118-0.976-7.071-2.929l-38.289-38.29 c-3.905-3.905-3.906-10.237-0.001-14.142c3.905-3.905,10.237-3.906,14.142,0l38.29,38.29c3.905,3.905,3.905,10.237,0,14.142 C119.078,367.843,116.519,368.82,113.96,368.82z"></path> </g> <g> <path style="fill:#5E2A41;" d="M75.67,368.82c-2.56,0-5.12-0.977-7.073-2.931c-3.904-3.906-3.903-10.238,0.003-14.142 l38.287-38.287c3.903-3.907,10.235-3.908,14.142-0.003c3.906,3.904,3.908,10.236,0.004,14.142l-38.294,38.293 C80.786,367.844,78.228,368.82,75.67,368.82z"></path> </g> <g> <path style="fill:#5E2A41;" d="M192.01,368.82c-2.559,0-5.119-0.976-7.071-2.929c-3.905-3.905-3.905-10.237,0-14.142 l38.29-38.29c3.905-3.905,10.237-3.905,14.143,0c3.905,3.905,3.905,10.237,0,14.143l-38.29,38.29 C197.129,367.844,194.569,368.82,192.01,368.82z"></path> </g> <g> <path style="fill:#5E2A41;" d="M352.77,259.55h-51.11c-5.523,0-10-4.477-10-10c0-5.523,4.477-10,10-10h51.11 c5.523,0,10,4.477,10,10C362.77,255.073,358.293,259.55,352.77,259.55z"></path> </g> <g> <path style="fill:#5E2A41;" d="M352.77,294.46h-51.11c-5.523,0-10-4.477-10-10c0-5.523,4.477-10,10-10h51.11 c5.523,0,10,4.477,10,10C362.77,289.983,358.293,294.46,352.77,294.46z"></path> </g> <g> <path style="fill:#5E2A41;" d="M152.99,421.39c-5.523,0-10-4.477-10-10V122.57c0-5.523,4.477-10,10-10c5.523,0,10,4.477,10,10 v288.82C162.99,416.913,158.513,421.39,152.99,421.39z"></path> </g> </g> </g> </g> </g></svg>'+
          '<center><h1 class="titre">Calculadora<h1>'+
     '<table><tr><td colspan="4" align="right" id="case"><span id="calc-output"></span></td></tr></table><table><tr><td><input style="display: block" class="numbir" type="button" value="1" id="button-1" onclick="btm(1)"/></td><td><input style="display: block" class="numbir" type="button" value="2" id="button-2" onclick="btm(2)"/></td><td>'+
     '<input style="display: block" class="numbir" type="button" value="3" id="button-3" onclick="btm(3)"/></td><td><input style="display: block" class="operator" type="button" value="C" id="button-C" onclick="btmClean()"/></td></tr><tr><td><input style="display: block" class="numbir" type="button" value="4" id="button-4" onclick="btm(4)"/></td><td>'+
     '<input style="display: block" class="numbir" type="button" value="5" id="button-5" onclick="btm(5)"/></td><td><input style="display: block" class="numbir" type="button" value="6" id="button-6" onclick="btm(6)"/></td><td><input style="display: block" class="operator" type="button" value="+" id="button-+" onclick="btmPlus()"/></td></tr><tr><td>'+
     '<input style="display: block" class="numbir" type="button" value="7" id="button-7" onclick="btm(7)"/></td><td><input style="display: block" class="numbir" type="button" value="8" id="button-8" onclick="btm(8)"/></td><td>'+
     '<input style="display: block" class="numbir" type="button" value="9" id="button-9" onclick="btm(9)"/></td><td><input style="display: block" class="operator" type="button" value="-" id="button--" onclick="btmLess()"/></td></tr><tr><td><input style="display: block" class="operator" type="button" value="x" id="button-*" onclick="btmMultiply()"/></td><td>'+
     '<input style="display: block" class="numbir"type="button" value="0" id="button-0" onclick="btm(0)"/></td><td><input style="display: block" class="operator" type="button" value="÷" id="button-/" onclick="btmDivision()"/></td><td><input style="display: block" class="operator" type="button" value="=" id="button-=" onclick="btmEgal()"/></td></tr>'+
     '<tfoot>'+
    '<tr><th scope="row" colspan="3"><input class="numbir" type="button" onclick="" value="" id="button-" style="display: block;width: 158px;"></th>'+
     '<td><input style="display: block" class="numbir"type="button" value="." id="button-." onclick="btm(.)"/></td></tr>'+
  '</tfoot>'+
     '</table></center>'+
     ' </div>'+
     ' </div>'+
   ' </div>'+
'</div>');
    function editDBF() {
        var x = document.getElementById('dbfwndw');
        if (x.style.display === 'none') {
            x.style.display = 'block';
        } else {
            x.style.display = 'none';
        }
    }
    $('.ui-dialog-titlebar-close').on('mousedown', function () {
        $('.dbf_icon').addClass('click');
    });
    $('.ui-dialog-titlebar-close').on('mouseup', function () {
       $('.dbf_icon').removeClass('click');
    });
    $('.ui-dialog-titlebar-close').click(editDBF);
    $( "#dbfwndw" ).draggable();

	$(function() {
    $('#skillPoints').on('input', function() {
        calculate();
    });

    function calculate() {
        var pPos = parseInt($('#skillPoints').val());
        var pEarned1 = parseInt($('#pointsgiven1').val());
        var pEarned2 = parseInt($('#pointsgiven2').val());
        var pEarned3 = parseInt($('#pointsgiven3').val());
        var pEarned4 = parseInt($('#pointsgiven4').val());
        var pEarned5 = parseInt($('#pointsgiven5').val());
        var pEarned6 = parseInt($('#pointsgiven6').val());
        var pEarned7 = parseInt($('#pointsgiven7').val());
        var pEarned8 = parseInt($('#pointsgiven8').val());
        var pEarned9 = parseInt($('#pointsgiven9').val());
        var pEarned10 = parseInt($('#pointsgiven10').val())
        var pEarned11 = parseInt($('#pointsgiven11').val());
        var pEarned12 = parseInt($('#pointsgiven12').val());

        var percBal = "";
        var percCom = "";
        var percSpee = "";
        var percResi = "";
        var percSpeed = "";
        var percPrec = "";
        var percTechn = "";
        var percPerf = "";
        var percBala = "";
        var percSpeedi = "";
        var percFocus = "";
        var percTechni = "";

        if (isNaN(pPos) || isNaN(pEarned1) || isNaN(pEarned2) || isNaN(pEarned3) || isNaN(pEarned4) || isNaN(pEarned5) || isNaN(pEarned6) || isNaN(pEarned7) || isNaN(pEarned8) || isNaN(pEarned9) || isNaN(pEarned10) || isNaN(pEarned11) || isNaN(pEarned12)) {
            percBal = "";
            percCom = "";
            percSpee = "";

        } else {
            percBal = ((pEarned1 / 100) * pPos).toFixed(0);
            percCom = ((pEarned2 / 100) * pPos).toFixed(0);
            percSpee = ((pEarned3 / 100) * pPos).toFixed(0);
            percResi = ((pEarned4 / 100) * pPos).toFixed(0);
            percSpeed = ((pEarned5 / 100) * pPos).toFixed(0);
            percPrec = ((pEarned6 / 100) * pPos).toFixed(0);
            percTechn = ((pEarned7 / 100) * pPos).toFixed(0);
            percPerf = ((pEarned8 / 100) * pPos).toFixed(0);
            percBala = ((pEarned9 / 100) * pPos).toFixed(0);
            percSpeedi = ((pEarned10 / 100) * pPos).toFixed(0);
            percFocus = ((pEarned11 / 100) * pPos).toFixed(0);
            percTechni = ((pEarned12 / 100) * pPos).toFixed(0);
        }

        $('#AA1').val(percBal);
        $('#AA2').val(percCom);
        $('#AA3').val(percSpee);
        $('#AA4').val(percResi);
        $('#AA5').val(percSpeed);
        $('#AA6').val(percPrec);
        $('#AA7').val(percTechn);
        $('#AA8').val(percPerf);
        $('#AA9').val(percBala);
        $('#AA10').val(percSpeedi);
        $('#AA11').val(percFocus);
        $('#AA12').val(percTechni);

    }
});

	$(function() {
    $('#skillPointsh').on('input', function() {
        calculate();
    });

    function calculate() {
        var pPos = parseInt($('#skillPointsh').val());
        var pEarned1 = parseInt($('#pointsgiven11').val());
        var pEarned2 = parseInt($('#pointsgiven21').val());
        var pEarned3 = parseInt($('#pointsgiven31').val());
        var pEarned4 = parseInt($('#pointsgiven41').val());
        var pEarned5 = parseInt($('#pointsgiven51').val());
        var pEarned6 = parseInt($('#pointsgiven61').val());
        var pEarned7 = parseInt($('#pointsgiven71').val());
        var pEarned8 = parseInt($('#pointsgiven81').val());
        var pEarned9 = parseInt($('#pointsgiven91').val());
        var pEarned10 = parseInt($('#pointsgiven101').val())
        var pEarned11 = parseInt($('#pointsgiven111').val());
        var pEarned12 = parseInt($('#pointsgiven121').val());
		
        var percBal = "";
        var percCom = "";
        var percSpee = "";
        var percResi = "";
        var percSpeed = "";
        var percPrec = "";
        var percTechn = "";
        var percPerf = "";
        var percBala = "";
        var percSpeedi = "";
        var percFocus = "";
        var percTechni = "";

        if (isNaN(pPos) || isNaN(pEarned1) || isNaN(pEarned2) || isNaN(pEarned3) || isNaN(pEarned4) || isNaN(pEarned5) || isNaN(pEarned6) || isNaN(pEarned7) || isNaN(pEarned8) || isNaN(pEarned9) || isNaN(pEarned10) || isNaN(pEarned11) || isNaN(pEarned12)) {
            percBal = "";
            percCom = "";
            percSpee = "";

        } else {
            percBal = ((pEarned1 / 100) * pPos).toFixed(0);
            percCom = ((pEarned2 / 100) * pPos).toFixed(0);
            percSpee = ((pEarned3 / 100) * pPos).toFixed(0);
            percResi = ((pEarned4 / 100) * pPos).toFixed(0);
            percSpeed = ((pEarned5 / 100) * pPos).toFixed(0);
            percPrec = ((pEarned6 / 100) * pPos).toFixed(0);
            percTechn = ((pEarned7 / 100) * pPos).toFixed(0);
            percPerf = ((pEarned8 / 100) * pPos).toFixed(0);
            percBala = ((pEarned9 / 100) * pPos).toFixed(0);
            percSpeedi = ((pEarned10 / 100) * pPos).toFixed(0);
            percFocus = ((pEarned11 / 100) * pPos).toFixed(0);
            percTechni = ((pEarned12 / 100) * pPos).toFixed(0);
        }

        $('#BA1').val(percBal);
        $('#BA2').val(percCom);
        $('#BA3').val(percSpee);
        $('#BA4').val(percResi);
        $('#BA5').val(percSpeed);
        $('#BA6').val(percPrec);
        $('#BA7').val(percTechn);
        $('#BA8').val(percPerf);
        $('#BA9').val(percBala);
        $('#BA10').val(percSpeedi);
        $('#BA11').val(percFocus);
        $('#BA12').val(percTechni);

    }
});

$(function(){
    $('#pointspossible').on('input', function() {
      calculate();
    });
    $('#pointsgiven').on('input', function() {
     calculate();
    });
    function calculate(){
        var pPos = parseInt($('#pointspossible').val());
        var pEarned = parseInt($('#pointsgiven').val());
        var perc="";
        if(isNaN(pPos) || isNaN(pEarned)){
            perc=" ";
           }else{
           perc = ((pEarned/100) * pPos).toFixed(0);
percBig = ((pEarned/100) * (pPos/4)).toFixed(0);
percCav = ((pEarned/100) * (pPos/3)).toFixed(0);
           }
        $('#pointsperc').val(perc);
        $('#pointsperc1').val(perc);
$('#pointsperc2').val(perc);
$('#pointsperc3').val(perc);
$('#pointsperc4').val(perc);
        $('#pointHop').val(perc);
$('#pointArq').val(perc);
$('#pointHop2').val(perc);
$('#pointBigas').val(percBig);
$('#pointCavaleiros').val(percCav);
$('#pointBigas2').val(percBig);
$('#pointCavaleiros2').val(percCav);
    }
});

(function($) {
    'use strict';
    function somme() {
        var nbr1, nbr2, nbr3, nbr4, nbr5, sum;
        var percentual = 0.30;

        nbr1 = Number($("#nbr1").val()) * 50;
        nbr2 = Number($("#nbr2").val()) * 10;
        nbr3 = Number($("#nbr3").val()) * 8;
        nbr4 = Number($("#nbr4").val()) * 16;
        nbr5 = Number($("#nbr5").val()) * 170;

        sum = Math.round(nbr1 + nbr2 + nbr3 + nbr4 + nbr5);

        var sumElement = $("#sum");
        sumElement.val(Math.round(sum * percentual));

        if (sum > 566) {
            console.log('Valor acima de 170. Mudando para vermelho.');
            sumElement.css({ color: 'red', fontWeight: 'bold' });
            $("#Posidon").css({ filter: 'drop-shadow(16px 16px 20px red) invert(5%)' });
            $("#Tposi").html("Colon Afundado");
            $("#Tposi").css({ color: 'red' });
        } else {
            console.log('Valor 170 ou abaixo. Mudando para verde.');
            sumElement.css({ color: 'green', fontWeight: 'bold' });
            $("#Posidon").css({ filter: 'drop-shadow(16px 16px 20px green) invert(5%)' });
            // Limpar mensagem em caso de mudança para um valor menor ou igual a 566
            $("#Tposi").html("Sem danos no Colon");
            $("#Tposi").css({ color: 'green' });
        }
    }

    $("#nbr1, #nbr2, #nbr3, #nbr4, #nbr5").on("change", somme);
    somme();
})(jQuery);

function limparCampos(campos) {
    for (var i = 0; i < campos.length; i++) {
        $('#' + campos[i]).val('');
    }
}

$(document).ready(function() {
    $('#resetBtc').click(function() {
        limparCampos(['nbr1', 'nbr2', 'nbr3', 'nbr4', 'sum']);
    });

    $('#resetBtp').click(function() {
        limparCampos(['pointspossible', 'pointsperc', 'pointsperc1', 'pointsperc2', 'pointsperc3', 'pointsperc4', 'pointCavaleiros2', 'pointHop', 'pointBigas', 'pointArq', 'pointCavaleiros', 'pointHop2', 'pointBigas2']);
    });

    $('#resetBtg').click(function() {
        limparCampos(['skillPointsh', 'BA1', 'BA2', 'BA3', 'BA4', 'BA5', 'BA6', 'BA7', 'BA8', 'BA9', 'BA10', 'BA11', 'BA12']);
    });

    $('#resetBtgh').click(function() {
        limparCampos(['skillPoints', 'AA1', 'AA2', 'AA3', 'AA4', 'AA5', 'AA6', 'AA7', 'AA8', 'AA9', 'AA10', 'AA11', 'AA12']);
    });
        $('#resetBtgi').click(function() {
        limparCampos(['inputfile']);
    });
});

(function() {
    'use strict';

    function calcularSoma() {
        var totalHoras = 0;
        var totalMinutos = 0;
        var totalSegundos = 0;

        $('#timeTable tbody tr').each(function() {
            var horas = parseInt($(this).find('.hour').val()) || 0;
            var minutos = parseInt($(this).find('.minute').val()) || 0;
            var segundos = parseInt($(this).find('.second').val()) || 0;

            totalHoras += horas;
            totalMinutos += minutos;
            totalSegundos += segundos;
        });

        totalMinutos += Math.floor(totalSegundos / 60);
        totalSegundos %= 60;

        totalHoras += Math.floor(totalMinutos / 60);
        totalMinutos %= 60;

        $('#totalTimeHHMMSS').val(
            padLeft(totalHoras, 2) + ':' +
            padLeft(totalMinutos, 2) + ':' +
            padLeft(totalSegundos, 2)
        );
    }

    function padLeft(value, length) {
        return ('0' + value).slice(-length);
    }

    $('#resetBtn').click(function() {
        // Limpa os campos .hour, .minute e .second
        $('.hour').val('');
        $('.minute').val('');
        $('.second').val('');

        $('#totalTimeHHMMSS').val('');
    });

    $('#calcularSomaBtn').click(function() {
        calcularSoma(); // Chamada movida para dentro da função anônima
    });

    $('#copiarBtn').click(function() {
        $('#totalTimeHHMMSS').select();
        document.execCommand('copy');
    });

    calcularSoma();
})();

(function() {
    'use strict';
    function injectCustomScript() {
        function btm(val) {
            document.getElementById("calc-output").innerHTML += val;
        }

        function btmClean() {
            document.getElementById("calc-output").innerHTML = "";
        }

        function btmPlus() {
            document.getElementById("calc-output").innerHTML += "+";
        }

        function btmLess() {
            document.getElementById("calc-output").innerHTML += "-";
        }

        function btmMultiply() {
            document.getElementById("calc-output").innerHTML += "*";
        }

        function btmDivision() {
            document.getElementById("calc-output").innerHTML += "/";
        }

        function btmEgal() {
            var egal = eval(document.getElementById('calc-output').innerHTML);
            document.getElementById('calc-output').innerHTML = egal;
        }

        document.getElementById('button-1').addEventListener('click', function() {
            btm(1);
        });

        document.getElementById('button-2').addEventListener('click', function() {
            btm(2);
        });

        document.getElementById('button-3').addEventListener('click', function() {
            btm(3);
        });

        document.getElementById('button-4').addEventListener('click', function() {
            btm(4);
        });

        document.getElementById('button-5').addEventListener('click', function() {
            btm(5);
        });

        document.getElementById('button-6').addEventListener('click', function() {
            btm(6);
        });

        document.getElementById('button-7').addEventListener('click', function() {
            btm(7);
        });

        document.getElementById('button-8').addEventListener('click', function() {
            btm(8);
        });

        document.getElementById('button-9').addEventListener('click', function() {
            btm(9);
        });

        document.getElementById('button-0').addEventListener('click', function() {
            btm(0);
        });

        document.getElementById('button-C').addEventListener('click', function() {
            btmClean();
        });

        document.getElementById('button-+').addEventListener('click', function() {
            btmPlus();
        });

        document.getElementById('button--').addEventListener('click', function() {
            btmLess();
        });

        document.getElementById('button-*').addEventListener('click', function() {
            btmMultiply();
        });

        document.getElementById('button-/').addEventListener('click', function() {
            btmDivision();
        });

        document.getElementById('button-=').addEventListener('click', function() {
            btmEgal();
        });
        document.getElementById('button-.').addEventListener('click', function() {
            btm('.');
        });
    }

    function waitForDocumentReady(callback) {
        if (document.readyState === 'complete') {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    }

    waitForDocumentReady(function() {
        injectCustomScript();
    });
})();

function adicionarBlocoDeNota() {
    var novoBloco = $('<div class="bloco-de-nota"><input type="text" class="titulo-input" placeholder="Título"><textarea class="nota-input" cols="96" rows="10" placeholder="Nota"></textarea><br><button class="format-btn" data-format="[b][/b]">[b]</button><button class="format-btn" data-format="[i][/i]">[i]</button><button class="format-btn" data-format="[u][/u]">[u]</button><button class="format-btn" data-format="[s][/s]">[s]</button><button class="format-btn" data-format="[center][/center]">[center]</button><button class="format-btn" data-format="[player][/player]">[player]</button><button class="format-btn" data-format="[ally][/ally]">[ally]</button><button class="format-btn" data-format="[size=7][/size]">[size]</button><button class="format-btn" data-format="[img][/img]">[img]</button><button class="format-btn" data-format="[spoiler=Spoiler][/spoiler]">[spoiler]</button><button class="format-btn" data-format="[table]\n[**][||][/**]\n[*][|][/*]\n[/table]">[table]</button><button class="format-btn" data-format="[quote=Author][/quote]">[quote]</button><button class="format-btn" data-format="[url][/url]">[url]</button><button class="format-btn" data-format="[town][/town]">[town]</button><button class="format-btn" data-format="[color=#6E0000][/color]">[color]</button><button class="format-btn" data-format="[island][/island]">[island]</button><br><button class="salvar-btn">Salvar</button><button class="deletar-btn">Excluir</button><button class="reset-btn">Reiniciar</button></div>');
    $('.containers').append(novoBloco);

    novoBloco.find('.reset-btn').click(function() {
        $(this).siblings(['.nota-input', '.titulo-input']).val('');
    });
}

        function adicionarFormato() {
            var notaInput = $(this).siblings('.nota-input');
            var formato = $(this).data('format');
            var nota = notaInput.val();
            notaInput.val(nota + formato);
            notaInput.focus();
        }

        function deletarBlocoDeNota() {
            $(this).parent('.bloco-de-nota').remove();
        }

        function salvarBlocoDeNota() {
            var titulo = $(this).siblings('.titulo-input').val();
            var nota = $(this).siblings('.nota-input').val();

            if (titulo.trim() === "") {
                alert("Por favor, insira um título para salvar a nota.");
                return;
            }

            salvarNotaNoDownload(titulo, nota);
        }

        function salvarNotaNoDownload(titulo, nota) {
            var notasTexto = titulo + "\n" + nota + "\n\n";
            var blob = new Blob([notasTexto], { type: 'text/plain' });
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = titulo + '.txt';
            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }

        $(document).ready(function() {

            $('#adicionar-btn').click(adicionarBlocoDeNota);

            $('.containers').on('click', '.format-btn', adicionarFormato);

            $('.containers').on('click', '.deletar-btn', deletarBlocoDeNota);

            $('.containers').on('click', '.salvar-btn', salvarBlocoDeNota);
        });

var loadedFileName = "";

document.getElementById('inputfile').addEventListener('change', function() {
    var fr = new FileReader();
    fr.onload = function() {
        loadedFileName = document.getElementById('inputfile').files[0].name;
        document.getElementById('output').textContent = fr.result;
    }
    fr.readAsText(this.files[0]);
});

const saveBtn = document.querySelector('button.save-file');

saveBtn.addEventListener('click', function() {
    console.log('Botão de salvar clicado');
    var textArea = document.querySelector("textarea");
    var textContent = textArea.value;
    console.log('Conteúdo do textarea:', textContent);
    var textBlob = new Blob([textContent], { type: 'text/plain' });
    var tempLink = document.createElement("a");
    tempLink.setAttribute('href', URL.createObjectURL(textBlob));
    tempLink.setAttribute('download', loadedFileName.toLowerCase()); // Usa o nome do arquivo carregado para o download
    tempLink.style.display = 'none'; // Oculta o link
    console.log('Link temporário criado:', tempLink);
    document.body.appendChild(tempLink); // Adiciona o link ao corpo do documento
    console.log('Link temporário adicionado ao corpo do documento');
    tempLink.click(); // Simula um clique no link
    console.log('Clique no link simulado');
    document.body.removeChild(tempLink); // Remove o link do corpo do documento
    console.log('Link temporário removido do corpo do documento');
});

let widthMachine = document.querySelector(".width-machine");

function calcHeight(value) {
  let numberOfLineBreaks = (value.match(/\n/g) || []).length;
  let newHeight = 20 + numberOfLineBreaks * 20 + 12 + 2;
  return newHeight;
}

let clear = document.querySelector('button#clear');
let textarea = document.querySelector('#output');

clear.addEventListener('click', function() {
  textarea.value = '';
});

textarea.addEventListener("keyup", () => {
  textarea.style.height = calcHeight(textarea.value) + "px";
});

$("#hide-btn").click(function(){
$(".hideshow").hide();
});
$("#show-btn").click(function(){
$(".hideshow").show();
});

const refreshBtn = document.getElementById("btnRefresh");
function handleClick() {
  window.location.reload();
}
refreshBtn.addEventListener("click", handleClick);