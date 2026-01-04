// ==UserScript==
// @name         queue preview partitioning script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  splits the queue previews into 5 canvases
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390717/queue%20preview%20partitioning%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/390717/queue%20preview%20partitioning%20script.meta.js
// ==/UserScript==

/**************************
   queue preview partitioning script
**************************/

(function() {
    window.addEventListener('load', function(){

		if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}
		var queueC = queueCanvas.getBoundingClientRect();

		for (var i = 0; i < 5; i++) {
		    var qCC = document.createElement("canvas");
		    qCC.id = "queueCopy" + i
		    qCC.style.position = "absolute";
		    qCC.style.left = queueC.left+"px";
		    qCC.style.top = queueC.top+"px";
		    qCC.style.clipPath = "inset("+73*i+"px 0px 0px 0px)"
		    qCC.height=(72*(i+1))
		    qCC.width=queueCanvas.width
		    document.body.appendChild(qCC)
		}

		var customStyleQueue=document.createElement("style");
		customStyleQueue.innerHTML='#queueCanvas {visibility:hidden;}';
		document.body.appendChild(customStyleQueue);


		var updateQueueBoxFunc = Game['prototype']['updateQueueBox'].toString()

		var inject = `;for (var i = 0; i < 5; i++) {
		        var destCanvas = document.getElementById("queueCopy"+i)
		        var destCtx = destCanvas.getContext('2d');
		        destCtx.clearRect(0, 0, destCanvas.width, destCanvas.height);
		        destCtx.drawImage(queueCanvas, 0, 0);}`

		updateQueueBoxFunc = trim(updateQueueBoxFunc) + inject

		Game['prototype']["updateQueueBox"] = new Function(updateQueueBoxFunc);


        var queueCopies = [queueCopy0,queueCopy1,queueCopy2,queueCopy3,queueCopy4];


        queueCopy0.style.top = (100 + 73 * 4) + "px"
        queueCopy1.style.top = (100 + 73 * 2) + "px"
        queueCopy2.style.top = (100 + 73 * 0) + "px"
        queueCopy3.style.top = (100 + 73 * -2) + "px"
        queueCopy4.style.top = (100 + 73 * -4) + "px"
        let skewX = "-30deg"
        let skewY = "70deg"

        queueCopies.map(x=> {
            x.style.transform = "skew(" + skewX + "," + skewY + ")";
        })

        //queueCopy0.style.transform = "skew(" + skewX + "," + skewY + ")";
        //queueCopy1.style.transform = "skew(" + skewX + "," + skewY + ")";
        //queueCopy2.style.transform = "skew(" + skewX + "," + skewY + ")";
        //queueCopy3.style.transform = "skew(" + skewX + "," + skewY + ")";
        //queueCopy4.style.transform = "skew(" + skewX + "," + skewY + ")";
		//queueCopy2.style.left = "800px"
		//queueCopy3.style.left = "200px"
		//queueCopy3.style.top = "100px"
		//queueCopy3.style.transform = "scale(1.5)"
		//queueCopy2.style.transform = "scale(1)"

	});
})();