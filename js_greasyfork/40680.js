


///Returns 'div' events
///requires default wall of events to exist
///all events will be with 'ayuEvent' class
function splitEventsIntoDivs() {
	var playerHolderDiv = document.createElement('div');
	var rawData = document.getElementById("content").innerHTML.split(/<br>/);
	var garbage =""
	while (rawData[0].includes('table') == false) {   //Вот тут удаляю предисловие
		garbage += rawData.splice(0, 1)
	}
	/*
        если последняя строка это кнопка- удалить
        //garbage = rawData.splice(-1, 1)   //Вот тут удаляю Просид
        */
	var eventquant = 0;  //колличество ивентов
	for(i = 0; i < rawData.length; i++){
		if(rawData[i].includes('table'))  //считать колличество ивентов исходя из колличества таблиц с аватарками
		{
			eventquant++;
		}
	}
	var cache = "";
	var textOutput = "";
	var filler = "";
	var eventArray=[];
	for(var q = 0; q < eventquant-1; q++){
		if(rawData[0].includes('table')){
			//Нарезание
			cache += rawData[0];
			rawData.splice(0,1);
			while( rawData[0].includes('table') != true && rawData.length > 0)
			{
				cache += rawData[0];
				rawData.splice(0,1);
			}
			for(var j = 0; j < cache.length; j++)
			{
				filler += cache[j];
				textOutput += cache[j];
			}
			let localEvent = document.createElement('div');
			localEvent.className = "ayuEvent";
			localEvent.innerHTML = filler;
			eventArray.push(localEvent);
			cache = "";
			filler = "";
		}
	}
	let localEvent = document.createElement('div');
	localEvent.className = "ayuEvent";
	localEvent.innerHTML = rawData;
	eventArray.push(localEvent);
	for (var i = 0; i < eventArray.length; i++) {
		playerHolderDiv.append(eventArray[i]);
	}
	return playerHolderDiv;
}


///remove color from `font` in `strong`
function removeColorStrong(){
	var s = document.getElementsByTagName('font');
	for(var i=0; i<s.length; i++){
	    s[i].removeAttribute("color");
    }
}

///replace wall of events to 'div' events
///as parameter takes output of 'splitEventsIntoDivs()'
function replaceEvents(a){
	document.getElementById('content').innerHTML='';
	document.getElementById('content').append(a);
}
