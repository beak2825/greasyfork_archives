// ==UserScript==
// @name           Virtonomica: фильтр тендеров
// @namespace      virtonomica
// @version        1.1
// @description    Дополнительный фильтр на странице "тендеры"
// @include        http*://*virtonomic*.*/*/main/competitionlist/tender
// @downloadURL https://update.greasyfork.org/scripts/25091/Virtonomica%3A%20%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D1%82%D0%B5%D0%BD%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/25091/Virtonomica%3A%20%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D1%82%D0%B5%D0%BD%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.meta.js
// ==/UserScript==
var run = function() {

	var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
	$ = win.$;

	function showAll() {
		$('table > tbody > tr[class]').each(function() {
          var row = $(this);
          if (($('#hide_tenders:checked').length === 1 && row.attr('class') !== 'over_league') || $('#hide_tenders:checked').length === 0){
			$(this).show();
          }
		});
	}
	function containsWord(haystack, needle) {
		return (" " + haystack + " ").indexOf(" " + needle + " ") !== -1;
	}
	function showByImgSrc(imgSrc, colNum) {
		var notFound = true;
		$('table.list > tbody > tr[class] > td:nth-child('+ colNum +')').each(function() {
            var cell = $(this);
			var img = $('> img', cell);
			if(img.length === 1 && img.attr('src') === imgSrc && (($('#hide_tenders:checked').length === 1 && cell.parent().attr('class') !== 'over_league') || $('#hide_tenders:checked').length === 0)) {
				cell.parent().show();
			} else {
				cell.parent().hide();
			}
		});
	}
	var ext_panel = '<br><div id="indicator_filter" style="padding: 2px; border: 1px solid #0184D0; border-radius: 4px 4px 4px 4px; white-space:nowrap; color:#0184D0;"></div>';
	$('table.list').first().before(ext_panel);
  	
	function updatePanel() {
      var alerts = {};
      
      function addAlert(img, colNum) {
          var imgSrc = img.attr('src');
          var imgTitle = img.attr('title');
          if (($('#hide_tenders:checked').length === 1 && img.parent().parent().attr('class') !== 'over_league') || $('#hide_tenders:checked').length === 0){
            if (typeof alerts[imgSrc] !== 'undefined'){
              alerts[imgSrc].cnt = alerts[imgSrc].cnt + 1;
            }else{
              alerts[imgSrc] = {
                cnt: 1,
                src: imgSrc,
                title: imgTitle,
                colNum: colNum
              }
            }
          }
      }
      $('table.list > tbody > tr[class] > td:nth-child(2) > img').each(function() {
          var img = $(this);
          addAlert(img, 2);
      });
      $('table.list > tbody > tr[class] > td:nth-child(4) > img').each(function() {
          var img = $(this);
          addAlert(img, 4);
      });
      $('table.list > tbody > tr[class] > td:nth-child(6) > img').each(function() {
          var img = $(this);
          addAlert(img, 6);
      });
      var alertsExists = 0;
      var lastColNum = 0;
      $("#indicator_filter").html('');
      $.each(alerts, function() {
          alertsExists = 1;
          var alertObj = this;
          var imgText = $('<i>',{
              title: alertObj.title,
              text: alertObj.cnt + ' ',
              click: function(){ showByImgSrc(alertObj.src, alertObj.colNum); return false;},
          });
          var img = $('<img>',{
              title: alertObj.title,
              src: alertObj.src
          });
          var input = imgText.append(img);
          if(lastColNum > 0){
            if(lastColNum !== alertObj.colNum) {
              $("#indicator_filter").append('<br>'); 
            } else {
              $("#indicator_filter").append('&nbsp;'); 
            }
          }
          $("#indicator_filter").append(input);
          lastColNum = alertObj.colNum;
      });

      if(alertsExists == 1){
          var showAllLink = $('<i>',{
              text: 'Сбросить фильтр',
              click: function(){ showAll();return false;}
          });
          $("#indicator_filter").append(showAllLink);
          $("#indicator_filter").show();
      }
    }
    $('#hide_tenders').click(function(){
      showAll();
      updatePanel();
    });
 	updatePanel();
}

if(window.top == window) {
	var script = document.createElement("script");
	script.textContent = '(' + run.toString() + ')();';
	document.documentElement.appendChild(script);
}