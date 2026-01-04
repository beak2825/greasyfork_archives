// ==UserScript==
// @name          Modify Tweetdeck Columns Height
// @namespace     http://userstyles.org
// @description	  Allows you to adjust each column in tweetdeck to your preference.
// @author        moebear
// @homepage      https://userstyles.org/styles/146213
// @include       http://tweetdeck.twitter.com/*
// @include       https://tweetdeck.twitter.com/*
// @include       http://*.tweetdeck.twitter.com/*
// @include       https://*.tweetdeck.twitter.com/*
// @run-at        document-start
// @version       0.0.0.1
// @downloadURL https://update.greasyfork.org/scripts/416056/Modify%20Tweetdeck%20Columns%20Height.user.js
// @updateURL https://update.greasyfork.org/scripts/416056/Modify%20Tweetdeck%20Columns%20Height.meta.js
// ==/UserScript==
(function() {
    var css = [
        "@namespace url(http://www.w3.org/1999/xhtml);",
        "#container > div.app-columns{",
        "    display: flex;",
        "  }",
        "  #container > div.app-columns > .column{",
        "    flex: 1.0;",
        "  }",
    ].join("\n");
    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
    } else if (typeof PRO_addStyle != "undefined") {
        PRO_addStyle(css);
    } else if (typeof addStyle != "undefined") {
        addStyle(css);
    } else {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            heads[0].appendChild(node);
        } else {
            // no head yet, stick it whereever
            document.documentElement.appendChild(node);
        }
    }




	function fixer(){
		for(var i =0;i<article.length;i++)
		{
			var articleProcessing = article[i]
			if(articleProcessing.getAttribute('isProcessing') && articleProcessing.getAttribute('isProcessing') == 'isProcessing' ){
				continue;
			}
			else {
				articleProcessing.setAttribute('isProcessing','isProcessing');
			}

			var gridNumber = parseInt(articleProcessing.firstElementChild.lastElementChild.lastElementChild.className.slice(-1,));
			if(!gridNumber)gridNumber=1;
			for(var j = 0;j<gridNumber;j++)
			{
				gridNumber = parseInt(articleProcessing.firstElementChild.lastElementChild.lastElementChild.className.slice(-1,))
				if(!gridNumber)gridNumber=1;
				var img = new Image();
				img.articleProcessing = articleProcessing;
				img.i = i;
				img.j = j;
				img.gridNumber = gridNumber
				var isGrid
				if(gridNumber !== 1) isGrid = true
				else isGrid = false
				var imageElement
				if(isGrid){
					imageElement = articleProcessing.firstElementChild.lastElementChild.lastElementChild.children[j].firstElementChild;
					articleProcessing.firstElementChild.lastElementChild.lastElementChild.children[j].style.setProperty('width','100%')
				}
				else{
					imageElement = articleProcessing.firstElementChild.lastElementChild.firstElementChild.lastElementChild
				}
				try{imageElement.style}
				catch(e){
					console.log(e);
				}
				var yUrl
				// check grid image
				try {
					yUrl = imageElement.style.backgroundImage.slice(5,-2).split("name",2)[0]+'name=large'
					console.log(yUrl)
				}
				catch(e){
					console.log(e);
				}


				img.onload = function(){
					var height, width
					if(this.width > 1830){
						height = this.height / this.width * 1830

						width = 1830
					}
					else
					{
						height = this.height
						width = this.width
					}

					var articlesIn = document.getElementsByClassName("stream-item js-stream-item  is-actionable ");
					if(this.gridNumber !== 1) this.isGrid = true
					var imageElement
					if(this.isGrid){
						imageElement = this.articleProcessing.firstElementChild.lastElementChild.lastElementChild.children[this.j].firstElementChild
						//set image height
						this.articleProcessing.firstElementChild.lastElementChild.lastElementChild.children[this.j].style.setProperty('height',String(height+4)+'px');
						//grid to a single img size


						//set total article height
						var heightOrigin = this.articleProcessing.firstElementChild.lastElementChild.offsetHeight

						if(heightOrigin === 350) {
							heightOrigin = 20
						}
						var heightOriginInt = heightOrigin + height

						this.articleProcessing.firstElementChild.lastElementChild.style.setProperty('height',String(heightOriginInt)+'px')

					}
					else{
						imageElement = this.articleProcessing.firstElementChild.lastElementChild.firstElementChild.lastElementChild
					}

					var imageUrl = imageElement.style.getPropertyValue("background-image")

					if(imageUrl.includes(this.src.slice(0,-10))){
						imageElement.setAttribute("style","background-image: url("+imageElement.style.backgroundImage.slice(5,-2).split("name",2)[0]+'name=large);'+ 'height: '+String(height)+'px;'+'width: '+String(width)+'px;')

						//this.y[this.j].style.setProperty("height",String(height)+'px')
						//this.y[this.j].style.setProperty("width",String(width)+'px')
					}
				}
					//check from single , grid

				img.src = yUrl
			}


		}
	}
    setTimeout(fixer,1000)
    var x=[]
    var y = document.getElementsByClassName("js-media-image-link block med-link media-item media-size-large   is-zoomable");
    var z = document.getElementsByClassName("js-media-image-link  pin-all media-image block ");
    var a = document.getElementsByClassName("media-image-container  block position-rel");
    var article = document.getElementsByClassName("stream-item js-stream-item  is-actionable ");

	var singlePost = document.getElementsByClassName("stream-item js-stream-item  is-draggable  ");
    var yLength = 0
    var zLength = 0
    setTimeout(fixer,10000)
    setInterval(fixer,"1000");
    //article.style.setProperty('height','10000px')
	//media-image-container  block position-rel to 100%
})();