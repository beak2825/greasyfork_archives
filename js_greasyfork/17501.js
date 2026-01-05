// @name           @marcos 
// @description    Só alegria.
// @author        Skype: taliton.rc
// @include       http://*screen=am_farm*
// @version        1.0
// ==/UserScript==

	var atualizarPagina = 1;
	var tempo = 700;
	var x = 0;
	var minhaVar = "";
	var remove_atacadas = 1;
	var menu = $('#am_widget_Farm a.farm_icon_b');

	var jaEnviados = $(menu).parent().parent().find('img.tooltip').length+"000";
	
	    if (remove_atacadas == 1) {
        $('img').each(function() {
 		var tempStr = $(this).attr('src');
			if (tempStr.indexOf('attack') != -1) {
			$(this).addClass('tooltip') 
            }
        });
    } 
	if(atualizarPagina == 1) {
      setInterval(
		function() {
			window.location.reload();
		}, 180000); 
	}
	
	console.log("Ja existe " + jaEnviados.substring(0,(jaEnviados.length - 3)) + " aldeia com ataque."); 

	var altAldTempo = parseInt($('#am_widget_Farm a.farm_icon_b').length+"000") - parseInt(jaEnviados);
	console.log("Resta " + altAldTempo + " aldeias para Atacar.");

   if (altAldTempo == "0") {
	var altAldTempo = aleatorio(4000,14000);	
   } else {
	var altAldTempo = parseInt(altAldTempo) + parseInt(aleatorio(4000,14000));
   }
  console.log("Resta " + altAldTempo + " milesegundos para alternar a aldeia.");

   function aleatorio(superior,inferior) {
	   numPosibilidades = superior - inferior
	   aleat = Math.random() * numPosibilidades
	   return Math.round(parseInt(inferior) + aleat)
   }
   

 
   for (i = 0; i < 100; i++) {
      $(menu).eq(i).each(function() {
         if (!($(this).parent().parent().find('img.tooltip').length)) {
		var tempoAgora = (tempo * ++x) - aleatorio(150,300);
                setTimeout(function(minhaVar) {
					$(minhaVar).click();
              }, tempoAgora, this); 
         }
       })
   }
   
	function altAldeia()
	{
		$('.arrowRight').click();
		$('.groupRight').click();
	}

   setInterval(altAldeia, altAldTempo);
   
  console.log("By Taliton R.C -> Skype: karlavmvieira");

