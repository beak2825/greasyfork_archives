// ==UserScript==
// @name         Raduga
// @namespace    http://tampermonkey.net/
// @version      4
// @description  try to take over the world!
// @author       You
// @match        https://gamdom.com/tradeup
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.js
// @downloadURL https://update.greasyfork.org/scripts/371465/Raduga.user.js
// @updateURL https://update.greasyfork.org/scripts/371465/Raduga.meta.js
// ==/UserScript==
(function() {
Object.defineProperty(document, "hidden", { value : false}); 
$(".chat-input").keyup(function (event) {
    if(event.which == 97)
    {
        event.preventDefault();
		$(".chat-input").val("красный");
    }
    else if(event.which == 98)
    {
        event.preventDefault();
		$(".chat-input").val("оранжевый");
    }
    else if(event.which == 99)
    {
        event.preventDefault();
		$(".chat-input").val("желтый");
    }
    else if(event.which == 100)
    {
        event.preventDefault();
		$(".chat-input").val("зеленый");
    }
    else if(event.which == 101)
    {
        event.preventDefault();
		$(".chat-input").val("голубой");
    }
    else if(event.which == 102)
    {
        event.preventDefault();
		$(".chat-input").val("синий");
    }
    else if(event.which == 103)
    {
        event.preventDefault();
		$(".chat-input").val("фиолетовый");
    }
    else if(event.which == 96)
    {
        event.preventDefault();
		let d = new Date();
		let n = d.getDay();
		switch(n)
		{
			case 1:
				$(".chat-input").val("Понедельник");
				break;
			case 2:
				$(".chat-input").val("Вторник");
				break;
			case 3:
				$(".chat-input").val("Среда");
				break;
			case 4:
				$(".chat-input").val("Четверг");
				break;
			case 5:
				$(".chat-input").val("Пятница");
				break;
			case 6:
				$(".chat-input").val("Суббота");
				break;
			case 0:
				$(".chat-input").val("Воскресенье");
				break;
		}
    }
});
})();
