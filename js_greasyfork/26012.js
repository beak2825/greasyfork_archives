// ==UserScript==
// @name           Virtonomica: Делаем видимым поле ввода процента и количества в управлении сертификатами корпорации
// @version        1.5
// @include        http*://*virtonomic*.*/*/main/corporation/token
// @description    Делаем видимым поле ввода процента и количества в управлении сертификатами корпорации
// @grant          none
// @namespace      virtonomica
// @downloadURL https://update.greasyfork.org/scripts/26012/Virtonomica%3A%20%D0%94%D0%B5%D0%BB%D0%B0%D0%B5%D0%BC%20%D0%B2%D0%B8%D0%B4%D0%B8%D0%BC%D1%8B%D0%BC%20%D0%BF%D0%BE%D0%BB%D0%B5%20%D0%B2%D0%B2%D0%BE%D0%B4%D0%B0%20%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D0%BD%D1%82%D0%B0%20%D0%B8%20%D0%BA%D0%BE%D0%BB%D0%B8%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%B0%20%D0%B2%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B8%20%D1%81%D0%B5%D1%80%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D0%B0%D0%BC%D0%B8%20%D0%BA%D0%BE%D1%80%D0%BF%D0%BE%D1%80%D0%B0%D1%86%D0%B8%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/26012/Virtonomica%3A%20%D0%94%D0%B5%D0%BB%D0%B0%D0%B5%D0%BC%20%D0%B2%D0%B8%D0%B4%D0%B8%D0%BC%D1%8B%D0%BC%20%D0%BF%D0%BE%D0%BB%D0%B5%20%D0%B2%D0%B2%D0%BE%D0%B4%D0%B0%20%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D0%BD%D1%82%D0%B0%20%D0%B8%20%D0%BA%D0%BE%D0%BB%D0%B8%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%B0%20%D0%B2%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B8%20%D1%81%D0%B5%D1%80%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D0%B0%D0%BC%D0%B8%20%D0%BA%D0%BE%D1%80%D0%BF%D0%BE%D1%80%D0%B0%D1%86%D0%B8%D0%B8.meta.js
// ==/UserScript==

var run = function() {

	var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
	$ = win.$;
	//alert("begin");
	var qtyInput = $('<input type="text" size="3">');
	qtyInput.change( function(){
  		//$('#qtySlider').html(qtyInput.value);
  		//$('#qtySlider').val(qtyInput.val());
  		//$('#qtySlider').change();
                $("#qtySlider").slider('value', qtyInput.val());
                loadDistributionData();
	});
    $("#qtySlider").after(qtyInput);
  
	var percentInput = $('<input type="text" size="3">');
	percentInput.change( function(){
  		//$('#percentSlider').html(percentInput.value);
  		//$('#percentSlider').val(percentInput.val());
  		//$('#percentSlider').change();
                $("#percentSlider").slider('value', percentInput.val());
                loadDistributionData();
	});
    $("#percentSlider").after(percentInput);
	//alert("end");
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}