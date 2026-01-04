// ==UserScript==
// @name         Twitter: GET THE BIRD BACK ENFORCE 還我鳥來!!!
// @namespace    https://www.plurk.com/SpyMomiji
// @version      1.1.3
// @description  替換會經常看到的那個沒設計感的東西...我會不會太閒?
// @author       SpyMomiji
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://images.plurk.com/4ijevWqGhP9oHMmhaFCS5y.png
// @run-at       document-start
// @noframes     true
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471673/Twitter%3A%20GET%20THE%20BIRD%20BACK%20ENFORCE%20%E9%82%84%E6%88%91%E9%B3%A5%E4%BE%86%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/471673/Twitter%3A%20GET%20THE%20BIRD%20BACK%20ENFORCE%20%E9%82%84%E6%88%91%E9%B3%A5%E4%BE%86%21%21%21.meta.js
// ==/UserScript==

(function() {

    //推特原本的 logo(svg) 與顏色
    var orig_svg = "M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z";
	var orig_color = 'rgb(29, 155, 240)';

    //分頁標籤的 favicon
	var orig_favicon = "data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJkSURBVHgB7VZBbtpQEH3zIW0WVYuXVaH4Bs0NSk4AOUFhEarskhMknIDsqkKlcIT0BNAT1D1B3ZJK3dmVuirwp/MhVmzAxiagKBJv9+ePZ97M/JkxsMMODwzChlD84FWQp3MxeCDHAhiumB+MJrr1+8Ryw3p/9+H4DctfIPCq49Xlw8Kv99YlMuB19885gy/i7llziwGfFFWJyR02XzSCuwiBUse7BlFVaz5LS8KQVkRXaXRJsqImfDjKSZBNyzEyFWFKVJ4KFbWLElUao6KbSk8i9TXgTPaorxTskPwOxa7/9baGt4zg8oQbNyfWYJlRU0/KUx9ZwNwYNq1ecFRzl18QpW0bB0Ks//KjV1uwlbuLJA3GxEdh5wb5yGEPl3qMd2xecYQHKnlFlVLX95kxYCFKGg5IlU2a0uLpCM68LEJA+sJ/Dm6Jy3aMjQIRakRUm+UuvfOp/X34iQSejeFo0Hdx4optG5uFH/R+GHNvANcm3VtwLs+Lvy2TRwhIOnrYHhysIuDKcCDwGbYAjglOzQt+HssElF6dvoNNOZeuCSbfSgIGMjILMo4/ExZf7TqghNLmlwm1gpSC2tmaLAZMvWGz0Iu7XpqBm2NrQNN5cD+Y5ZOTdZyok3RZMusZOJUN+QZrQFb0oQkG6xIIYHe8A03Unx/Ryd6jS2ctAsbxmFRVynGKlM5na5ePVkUe0p+h9MmraS2zXqYgmSWjOPtElHbLTVB3Q79gqQlMScxqXpeav0UWiGMmXKSNOpZAAPvKs/U/1MRoxRxl+5WD+psUy2D5IdmRVoWjnqDnLlkyO+zwaPAf1zXwZL751PUAAAAASUVORK5CYII=";

    var triggerOnAnimationFrame = ( window.requestAnimationFrame || window.webkitRequestAnimationFrame );

	class GeneralInterval{
		constructor( func, options ){

			options = {
				interval: 1,
				...(options??{})
			};

			var intervalSetting = (!triggerOnAnimationFrame && !options.interval)? 1 : options.interval;
			func = func.bind(this, options.attr );

			this.enable = true;
			this.attr = options.attr;

			if(intervalSetting){
				this.interval = setInterval( func, intervalSetting );
				func();
			} else {
				var loop = (function(enable){
					func();
					this.enable && triggerOnAnimationFrame( loop );
				}).bind(this);
				loop();
			}

		}

		stop(){
			this.enable = false;
			clearInterval(this.interval);
		}

	}


	//探測 react 載入狀態
	var icon_stage_1 = ()=> new GeneralInterval( function(){
		if( document.getElementsByTagName('main').length || document.getElementsByTagName('header').length )
			icon_stage_2() && this.stop();
	}, {interval: 0 })


    //處理掉左上角的 X
	var icon_stage_2 = ()=> new GeneralInterval( function(checked){
		var target = Array.from(document.getElementsByTagName("a"))
		.filter( i=>
			!checked.has(i) && checked.add(i) &&
			i.role=="link"&&
			( i.ariaLabel=="X" || i.ariaLabel=="Twitter" )&&
			( i.href=="https://twitter.com/home" || i.href=="https://twitter.com/" || i.href=="https://x.com/home" || i.href=="https://x.com/" )
		)[0];

		if(!( target && (target.ariaLabel = "Twitter") && (target = target.getElementsByTagName("svg")[0]) ))return;

		target.getElementsByTagName('path')[0].setAttribute('d',orig_svg);
		target.style.color = orig_color;
		this.stop();
	}, {attr: new Set(), interval: 0 })

	icon_stage_1();


	//處理掉載入畫面的 X
	new GeneralInterval( function(){
		var target = document.getElementById("react-root");
		if(!( target && (target = target.getElementsByTagName("svg")[0]) ))
			return document.readyState == 'complete' && this.stop();

		target.getElementsByTagName('path')[0].setAttribute('d',orig_svg);
		target.style.color = orig_color;
		this.stop();
	})


	//處理掉分頁標籤的 X
	new GeneralInterval( function(checked){
		var target = Array.from(document.getElementsByTagName("link")).filter( i=>
			!checked.has(i) && checked.add(i) &&
			i.rel=="shortcut icon"
		)[0];

		if(!( target ))
			return document.readyState == 'complete' && this.stop();

		target.href = orig_favicon;
		this.stop()
	}, {attr: new Set() })


	//處理掉分頁標籤名稱中的 X
	new GeneralInterval( function(){
		if( this.pageTitle == document.title ) return;
		if( document.title == 'X' ) return this.pageTitle = document.title = 'Twitter';
		var match = document.title.match(/(.*)\/ X$/);
		match&&(this.pageTitle = document.title = match[1] + '/ Twitter');
	}, {interval: 100 })


})();
