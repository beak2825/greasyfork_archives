// ==UserScript==
// @name          Kinopoisk Extender
// @description   Расширение функционала kinopoisk.ru.
// @namespace     https://greasyfork.org/ru/scripts/21933-kinopoisk-extender
// @author        Activa & ALeXkRU & hossam6236
// @license       CC BY-SA
// @version       1.10.13
// @homepage      https://greasyfork.org/ru/scripts/21933-kinopoisk-extender
// @require       https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @include       https://www.kinopoisk.ru/film/*
// @include       https://www.kinopoisk.ru/series/*
// @run-at        document-end
// @grant         GM_xmlhttpRequest
// @grant         GM_addStyle
// @icon          https://www.kinopoisk.ru/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/21933/Kinopoisk%20Extender.user.js
// @updateURL https://update.greasyfork.org/scripts/21933/Kinopoisk%20Extender.meta.js
// ==/UserScript==

if(typeof jQuery=='undefined') {
    var headTag = document.getElementsByTagName("head")[0];
    var jqTag = document.createElement('script');
    jqTag.type = 'text/javascript';
    jqTag.src = 'https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js';
    jqTag.onload = jQueryCode;
    headTag.appendChild(jqTag);
} else {
     jQueryCode();
}

function jQueryCode(){
	var ru2en={
		ru_str:"АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя",
		en_str:["A","B","V","G","D","E","YO","ZH","Z","I","Y","K","L","M","N","O","P","R","S","T","U","F","KH","TS","CH","SH","SHCH","","Y","","E","YU","YA","a","b","v","g","d","e","yo","zh","z","i","y","k","l","m","n","o","p","r","s","t","u","f","kh","ts","ch","sh","shch","","y","","e","yu","ya"],
		prc_str:["%C0","%C1","%C2","%C3","%C4","%C5","%A8","%C6","%C7","%C8","%C9","%CA","%CB","%CC","%CD","%CE","%CF","%D0","%D1","%D2","%D3","%D4","%D5","%D6","%D7","%D8","%D9","%DA","%DB","%DC","%DD","%DE","%DF","%E0","%E1","%E2","%E3","%E4","%E5","%B8","%E6","%E7","%E8","%E9","%EA","%EB","%EC","%ED","%EE","%EF","%F0","%F1","%F2","%F3","%F4","%F5","%F6","%F7","%F8","%F9","%FA","%FB","%FC","%FD","%FE","%FF"],
		translit:function(j){
			var g="";
			for(var l=0,h=j.length;l<h;l++){
				var k=j.charAt(l),i=this.ru_str.indexOf(k);
				if(i>=0){g+=this.en_str[i];}
					else{g+=k;}
			}return g;
		},
		decode_mv:function(j){
			var g="";
			for(var l=0,h=j.length;l<h;l++){
				var k=j.charAt(l),i=this.ru_str.indexOf(k);
				if(i>=0){g+=this.prc_str[i];}
					else{g+=k;}
			}return g;
		}
	};

	/*Browser detection patch*/
	/* from http://pupunzi.open-lab.com/2012/08/14/jquery-1-8-and-browser-detection/ */
	jQuery.browser = {};
	jQuery.browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase());
	jQuery.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
	jQuery.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
	jQuery.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
	jQuery.browser.chrome = /chrome/.test(navigator.userAgent.toLowerCase());

	const API_KEY_OMDB = 'c989d08d';
	var movie_imdbID = "";
	var loc2="";
	var nl="";
	var bseries = false;
	var lkp=location.href;
	try {
		$(document).ready(function(){
			var movie_nr="";
			//	var lk="https://yohoho.cc/#";
		if(lkp.match('kinopoisk.ru/film/')){
				loc2=lkp.split('/film/')[1];
				nl=loc2.split('/')[0];
		//		movie_nr=lk+nl;
				movie_nr=nl;
				bseries = false;
		} else {
			if(lkp.match('kinopoisk.ru/series/')){ //сериалы(аниме)
			//	bseries = true;
				loc2=lkp.split('/series/')[1];
				nl=loc2.split('/')[0];
				movie_nr=nl;
			} else {
				movie_nr="";
			}
		}

			var movie_eng=$("span[class^='styles_originalTitle__']");
		//	var movie_rus=$("h1[class^='styles_title__']>span[class^='styles_title__']");
			var movie_rus=$("h1[class^='styles_title__']>span[data-tid]:nth-child(1)");
			var movie_yr1=$("DIV[class*='styles_basicInfoSection']>DIV[class*='styles_topLine__']>DIV[class*='styles_column__']>DIV[class='']>DIV[class*='styles_rowLight__']>DIV[class*='styles_valueLight__']>a[class*='styles_linkLight__']");
			var movie_yr2=$("DIV[class*='styles_basicInfoSection']>DIV[class*='styles_topLine__']>DIV[class*='styles_column__']>DIV[class='']>DIV[class*='styles_rowDark__']>DIV[class*='styles_valueDark__']>a[class*='styles_linkDark__']");
			var movie="";
			var movie2="";
			var movie_ru="";
			var movie2_ru="";
			var newLbl="";
			var year="";
			if(movie_eng.text()!==""){
					movie=movie_eng.text();
				//	movie=encodeURIComponent(movie); // кодируем пробелы
			/*		movie2=movie.replace(/\u00a0/g,' ').replace(/[«»·]+/g,' ').replace(/  +/g, ' ');
					newLbl=$(movie_rus[0].outerHTML);
					$("span",newLbl).remove();
					movie_ru=newLbl.text(); //alert(movie_ru);
					movie2_ru=movie_ru.replace(/\u00a0/g,' ').replace(/[«»·]+/g,' ').replace(/  +/g, ' ');
		*/			movie_ru=movie_rus.text();
					movie2_ru=movie_ru.replace(/\u00a0/g,' ').replace(/[«»·]+/g,' ').replace(/(\(\d{4}\))+/g, ' ').replace(/  +/g, ' ');
			} else {
			/*	newLbl=$(movie_rus[0].outerHTML);
				$("span",newLbl).remove();
				movie=newLbl.text();
				movie2=movie.replace(/\u00a0/g,' ').replace(/[«»·]+/g,' ').replace(/  +/g, ' ');
				movie2_ru=movie2;*/
				movie=ru2en.translit(movie_rus.text());//если movie_eng нет, берем транслит для рус
				movie_ru=movie_rus.text();
				movie2_ru=movie_ru.replace(/\u00a0/g,' ').replace(/[«»·]+/g,' ').replace(/(\(\d{4}\))+/g, ' ').replace(/  +/g, ' ');
			}
//alert(movie_yr1.html());alert(movie_yr1.text());alert(movie_yr1.attr("href"));
//alert(movie_rus.text()); //alert(movie_rus[0].outerHTML); alert(movie_eng.text());
			if(movie_yr1.text()!==""){
				year=	movie_yr1.html();
			} else {
				if(movie_yr2.text()!==""){
				year=	movie_yr2.html();
				} else {
					year=movie_yr2.attr("href");
				}
			}
			var movie_enc=encodeURIComponent(movie); //eng с кодировкой пробелов
			var movie_imdb=ru2en.translit(movie_ru); //eng с кодировкой пробелов + транслит для рус
			var movie_allm=ru2en.translit(movie);    //eng с кодировкой пробелов + транслит для рус
			var movie_hdclub=ru2en.decode_mv(movie_ru);  //рус в веб-кодировке
			var movie_nnm=encodeURIComponent(movie2_ru); //рус с кодировкой пробелов
			var movie_subs=movie_allm.toLowerCase().replace(/  +/g, ' ').replace(/ /g, '-'); //eng нижний регистр+дефисы вместо пробелов
			var imdb_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAA3NCSVQICAjb4U/gAAABS0lEQVQokc1Su0oDURA9c+/e3WgWY4hCTKGBBIlGC8VHo4Wtf2ApgnZiHetUapkvsPU3YiFWIqYQFJEgKgRMsnnsZu9Y7IZsm0acYmaKc4YzZ4acahrjhBgL/ScEIyhSAgwiaIYYZgBaQwj4GswRgpS4e3QTtqh/DQpZVXv1shnj/dP3fV4rmA/PXjGnZqeFrwFAnh/ZpqLtw0bc5ONyK2HzSbm9khMHpabrDu6f3LOr9lZRzc9JZdBoh3yGYhYBuLzuATAVAOyux5gxkxSlSiu1922qCAEAA6YlTEWby0agmAjM+Olgf8cCmKIu3dZ0p8tuX6/mxcaS7PYZwOmFk0qS19eVm14wEQA51bQQePvwJyxqOjoeIykJQKOpWWNxwXipDyxF9iQlpwQzKHgNIQAGaCgOoMBWDhvm0NnwDlqPoKOdEEKj8Q9/6RcF1Hrkxxdk8wAAAABJRU5ErkJggg==";
			var fvico_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABs0lEQVR4AWL4//8/RRjO8Iucx+noO0O2qmlbUEnt5r3Juas+hsQD6KaG7dqCKPgx72Pe9GIY27btZBrbtm3btm0nO12D7tVXe63jqtqqU/iDw9K58sEruKkngH0DBljOE+T/qqx/Ln718RZOFasxyd3XRbWzlFMxRbgOTx9QWFzHtZlD+aqLb108sOAIAai6+NbHW7lUHaZkDFJt+wp1DG7R1d0b7Z88EOL08oXwjokcOvvUxYMjBFCamWP5KjKBjKOpZx2HEPj+Ieod26U+dpg6lK2CIwTQH0oECGT5eHj+IgSueJ5fPaPg6PZrz6DGHiGAISE7QPrIvIKVrSvCe2DNHSsehIDatOBna/+OEOgTQE6WAy1AAFiVcf6PhgCGxEvlA9QngLlAQCkLsNWhBZIDz/zg4ggmjHfYxoPGEMPZECW+zjwmFk6Ih194y7VHYGOPvEYlTAJlQwI4MEhgTOzZGiNalRpGgsOYFw5lEfTKybgfBtmuTNdI3MrOTAQmYf/DNcAwDeycVjROgZFt18gMso6V5Z8JpcEk2LPKpOAH0/4bKMCAYnuqm7cHOGHJTBRhAEJN9d/t5zCxAAAAAElFTkSuQmCC";
			var wiki_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAZ9JREFUOI2lk6+LQkEQx79zXHhNRKxW/wyLgmI7RHnJoF0MJhW7BsE/wGKxeAgW2zWDNssrImgR5PnuIYrJ/V7wvcVfHB43sDCzO9/PDrszAACSA6WUQ5JKqV+Xl+OQHACAeM6HB8IrJiK++ylKKUdEgq+KryEkv4V/Vd7Z2263g2maEBFEIhHM53PUajWICJLJJCzLQj6fh4ig1+thMplARJDL5eC6LkDPEokEK5WKHzKbzbJUKpEkR6MRx+OxPovH49qH/7Kz2YwAeDweSZKr1YoAuN1umclktGA6nbLf7/u/cQH4kHA4zHa7rZNN0yQALhYLvVcsFrX/ABgOhwSgY8uyCICbzYYkads2m82mFj8AvB/RJbZaLaZSKRYKBZJktVrl4XB4DvAh3W6XALjf79npdLherwmAy+WSjUbjRvwUcDqdCIDRaFRXlU6nCYC2bT8A3r2OAnBpZcMwUC6XEYvFdLPU63UYhoFQKHTT7iIC3A8RSbquy/P5fLPnOA7v85RSzpuIfGmaV0UgELgeGJBEMBjUt/tnvvZf4/wDmd5ikVi4iZ4AAAAASUVORK5CYII=";
			var rtr_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAAflBMVEVHcEwAymoAzGM1TesAzWLpHD00TOo2TekCyGjmHUI2SuzXI0wA2VvkHkAfv1vjH0VRRdM0UOY0TegAzmPmGTMA0V83TOblHUEAzGPYJ0Q1TebjHkMtS/AH0lI1T+T2DzsA2mXwFTwgtF0AzWMzTex3PK6ONpoiUfgAzmPjH0TAm7EFAAAAKHRSTlMAGLxW++uk/ljZ8ZfUOkRzQma9Zwqk107rGpTAESKBwLaqhM7Xfmz0WmgDGQAAAKBJREFUGJVVj9kWgyAMBSOCrNaqdd+q3cj//2ARuhznbe7hJgHgR3OBAw2mB08ZZvB900kpEVF2QaMJMqdMItO+JaiAAVHHC+KwBydrrxrZ4/Vkma8IF6y4Jvx+DjOItduiTwXnqq4LiIillmzGzHwnhsp6qK0S5/O+tWydUmOE4jxMcWvIlPeFb3hubQSuoBRPQlAKcEE8jnn//1z+OeINbNYMSNFVNogAAAAASUVORK5CYII=";
			var i7tor_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAyBJREFUOI1dk0toXGUYhp///8+cmTnTuWXSSDJTO0IrBhdqLypq1VZEoYEKiouiRRC1uBE3bupKcFEoijsX0kUpKOJGKl4WtVhvaLyUGiGm9mI77WQmk0nmfk7OOf/nwgar7+Z7+Xh5Ni+v4n9qyI6CkHhUE90OJC3SiTBNF33GRc0V1HdrN+bVupHaNJ1yZvsIdXzxir951TemUElcc9POlRRx6CF/OuhzLoNjuffnmmr/DYBTchcV1KGoxRvtNa3cqeLJ7ajjaskm6diE3eKs1gimeoTVEnE9g3yeDX/8SbnXAefk7umoFf3WDsTE5erzu478USVQB8inx0gnDMp0SURfrTybe69G78Eislxi6ainzvdUU+4lxp65dDW6o1Xe/PLM/m+fYtvGPX4+i856aM8FrXEkguWg1nou+XSd3v0VWCha5xM9QPaNetHWenny15l36sJt2T0jk8B4KXQ2jSnlcTYWsGkPSqnK+LHuK2nc+RGqeF63yjoJu3sD6+3GPcps7aCvNcp1UCkHk0mixoswUULnMsTaAUk8nMUZDcEUyRW0QiZHGALcv3C1F9v1Wq5fa8EKyPrLbrhpzpa76EZEhKNAI+DjhEQIYYz4IdZfg94Qo9pgNDL0kVEAozCmlLIO3KlwxFHQ9LTgoW6mb3omEOzIR/pJrFYQWdD6H+jQh67fXZkca+UYPukTz+sYezqTssGJsP8CWyuHU0OFdANsu4ttdogbHeLFFeKlVdxuD8Lg4wbxIwliR2MWtUJ96uUTF2+tX97x5eGdec52PswEBtsNiFd6RO0OUbtDatBHLbTOnj607Ys1/MddZDkBcwpgUXY90G71v270Iag+9MxjB79PsXrtNfImh2s1oe2Tznxw6u2dP4SX5z+qbpCV7JjMTKlfZhXAkuxjRP2tQSt8tTEw9sKmLScP6MyRJXIC4qRpxgt0Xho1W3u9gZ/cdIt5UxO8PqF+/3dMF2QaB29vAvPuanOtMhBDdyDEQCGt8IxlfCJRC7Ev9pDPptXP/13juq7KPVWQJxTcp6GqAUFdFOQbjZyYULOXbsz/DaXydamsSR7HAAAAAElFTkSuQmCC";
			var allmovie_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAXpJREFUOI2lkk9LAlEUxc/4tzGFFFEXMq6MCASpTdAiqDalLYqQqHWZ0LT1S7Rt0VfoC0iEiIvCRRQJKo6bHEHThX/GhYnNmzbNc9C388KDw72/dzjv8oAFiws/1jUAqCVCVFv9gpsFT9pyb5alAiazCqKaAcDEu4YsAzIauuZYfVg7DVooaeII8zDY6SVDVWPuFVafpjUUTbCe195mh+mUGEunxNhs38jSBJqqBoyQJncsm7H9y3/9xAm+XxZLE1R2LUGjQSaXjQwU5WCgKIeZXDZinBlZ5g40uWPeOztJ2G02CQDuHu4TmtwprhZGcyxNsPb8823oexut5pXL6Xx3LTs/Gq1mEoCXxVIDk83+peuL2+s4IcTT7ffj3UE/Tghxn4vJIxZLDco73JauP8sl0cHzL1K+sCHlC1EHz78WK+UbFsvcQUmqRgGAE3x6axsAwsDcP5j+aat9rE3GdgCw+oU6y3jSlkOzLH2CdBxY0rWq9Dysw2IXrj98oq7vSD1iyQAAAABJRU5ErkJggg==";
			var criticker_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAA3NCSVQICAjb4U/gAAACb0lEQVQokX3PO0xTURwG8HPPObePFOittKUtUiEQCpLQIBrFiBAXEzVG46DGxDgY3Y2Lq25q4qZxcsbFuOhghIQJURCsUKHYS59AH9zS9tL7Ov/jwEjjN39f8v0Ezjn6b15PfQ35PZbF5mPJ549u0r16Y+lPyibSsWjfQUMzTKWqZrZ3k7niZq44Mx+/NB7dzBZM4AghGpfzO+Xqj5Xkp9mf6UIlmS3I+VJZqVkMGAcqCFKb6/6NiUh3YHZxDSFEHaKY2SnH5Xwske0Nd/R0+iZPDgR9UlfHkaBPCnmlD9MLC79lQLxUqSOEqLvVyTkfPd7z7tkDr9Ry2NDmcvYdC0QjXVOf53TDpA6baBdFwYUJFpqiHXZxdnFtI7W9mS8hJGBCiFJVy3s1QWg+aJdaz0T77l0bP+r3aLpBRUocdnFfM1aTOa/UalrMYmAxZjFgjAGgX+vpb7G/cqawKm9hjKkgCG0tTovBxYcvkCAA58A5AADnHDhwzg3z1ZO7VydHVM1QGzq1iVgzTE03Xz6+PdgTMhkD4ADAgAMAQiiZKUx/jyvV/VgiazFGCcY2SikWhvvDY8O9hw1yrtjQzesXRjVdr9Y1SglxOWzgdtXURlM0wXh5PW2Z1tJa+pZpUkIwJkTZU5Wq2nTgctoHuoOXJ0/ohllTGxQhRLDACX769uOb99NBrxTyS51+T8DrDnk9AZ9bJCRfrMzMry4nMudPDVKE0FBvZzjYXqs3DNOSc8UvcyvF3Wql3gAGwLnA2MTpoTtXzio1VdUMihCKRsIIoXMj/QcfALiq6buVeragpLZKidTO0lpqI7UdT+Yj3cF/dktQ+wjrMXAAAAAASUVORK5CYII=";
			var google_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAglJREFUOI2Nk99L02EUxj/vNkthRdToFxLNJqaJESYVXtSN3ZS1CqMM6qKLQKJ/oPsF3eV1F1HRBrVcGV4FdRPeJUK0oeYaUmyzRbOxpvtuTxd+v7atIA+ci/e8z3nOe57zHmgwSQFJEUkzksq2z9ixtkZ8bSKSxvR/i0r6Z3LCQRRfxZS7claZ7u3KHPApd3lQxfE67rhDYmyCMSCo5RLfh89QSc6A2w1WebWCZwNaLtLU08fWxy+cus+NMRecniVJi+dOKtPfrUzPLhUij2TNz8lKzqkQfqjs0XZV8j8a2/FjiyPrQ1iZI61Kd+yUtZBahxSSpDC2wrImA1qZQMXo6HqTJSnhAfwAys9h3NA80FsnsLn1kw6vWTv/qkCwy829ay0AbZ46sMBUGkZUY9uaDW4DtQgXkATwbG6nBEwsxOtHPLqJRMhLIuTl4mEPhbLY53M51/Mu4D1AevcdDi6e4NRUhM9LX/6qns3D/UmLchX6O9cePmW0+j0/AQzErvO1mOVbpcjdQyMca+3FZVxMp6e5/SaFL32DPT6LJzdbHAK/85GiwPlSdYXg+Agfl1J4jJuyKghoMi5kCuzQcd4OhWjZCMAzY8yQQwAQB/YDvJx9zYPZGO9ycapA35YAVwOnudQ56FSOA13G/JmOsw/Rdcz+qRqXqU51yS8prNXlWrE9Ycf2NuJ/A6uf5JCErH2FAAAAAElFTkSuQmCC";
			var kinozal_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAs5JREFUOI11k2tIk3EUxn/v61tpbZb4amosUTNGlkhleakPUbguewW1T9OiyFZiSBkjog/OCLrIunyIoguUZUFQo61cGoF3w0hMoUwrIcxqZTfKwLb9+2DNSnrgwOE5h/Ocw8PB5hDmbJNdZJvswuYQZoA/uf/xvzkp22QXjkP5GA16am73U+/pJCF5FtuL0olVZQa9Ado6B3E6O8jMSKKsKJnXn0PYUuaktc4uKQBGg54w6QtWbSZWbQ2y5AdGADDGgHFtJBtWr0UIGJHCiQn/RBA2hzCfrr4rRj88Eienhf4V/o+dwv+xUzyz5oprBlU0LVsgRt51iZI9F4MnyFW7pVuXaloRAnLOHyYyQgeM5QD9lUdpvt7AsFDw6iMB6O4aoGq3dAtAtjmEeZIio8gBEk3Lg5slmpbzrLaBNy3tLNpfjrWnlrwrR5miBEg0hBPc4Ku32p1fkAEIAHx+/5hymY2Gkn281amkWHL5E4sy5vPVW+0GkLu7BliZOZt/cfPSPRbuLWW989SE2sIFKt1dAwDIAFH6H8GiEhICQHycSseJi7w4fmbCgHh1PJdT0xIY9ctBYuT7KADLdhSQljKLG5Wnabds59vb98Gel8OQmpYwNkAXvVE7dbl7gkpsyTYWnz2CcV48rZ4Oeg4cRwQCANTW96KL3qjBLxsbmp4CMOxxAxAWOplhjxslQmXpzkLUGTpaLtfyoLAUgKbmvqCNITaHMBuihyyrMqKoXrEZn8+Pz+fnsbuFxeVbCDXEQdhUQtUIHroamRaj8ko3hxX5zodt9ZV9UrbJLpznconUTbjiv3gyBNvKXeO/cOG2l03rojl49jEPOp6TviSJAvM85sZC7xC4PU9oa+8nPT2JrZYUep9/HnchK6dCu+m8T16xC2V6odZyp0JSphdqNdd7yCt2cfVGD+gtWmudXZoUUaRZd7k4drKRrJwKDeAngDcnn3757PAAAAAASUVORK5CYII=";
			var movieposter_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAZiS0dEAP8A/wD/oL2nkwAAAq5JREFUOI2Vks9L23cYx1/fNBs6TGNRM0o76LpBx2xpVsxg1MtOY+4fGO5WGPsLum7Og0wPuRWUHT2keGgbiRPGMJkHoWmhWaH5aqJp/RWt3eIOiTGaJvl+v5/3DhuWlg66B57b83o/7+fNA/+/hsLh8P1Ll/qiAP7XIWZnZ8fPnD376V65ct62s8wkZth5uhMCvnslsC91rK6u3xgZGVkHdAz07dWrSiQSsm1bmUxGExMTmZe5z4CZgYEv/pybS2pjc1Pb20/0MJtVLHZD/f2XnwH3gB9eoFKp1K3d3b+q5XJFCwsLGhoa0gfnzunUyZOKRqPlxcWlZDabvfKf91mwens6oTvpuyoWt1QuV3bmUqlpoP918uH7a9eu51YeqbC2oStff5MB+FWrSHphrnQgHvyhV2qMzv02rwcPbd27/7vWNzY1OTkpQGNjYyoWt5TPL2twcFCAYrGYVgoF3bx5S8AvAGMT4+O6k05rOj6tgc8HBCgej6tU2lU6fVdvgkJdJ5RMJpXL5TU6+qMARfr6frYApqam1mq12nvz8/OsLOeJRD6mLxKhWq0yPDzM291dfDn4FT2hEIu2ze14nAvne2uLS7lPLID33z2TPh7svNzW3o7P56PZaLBXqSBEIBDAGLFf3WNz+wnB9jY6u7o45vc/3ShunfYDdBwP8mFv71EoxhgkYYyQMUgGzxguXAwjifrhIY8KBQ/+fWXHcbxWs4llWRgJvdTGGIwxtFotkGg2mxiZ5wJv+P0ml1vC8/7Z7DgOPp/vyE2z2cDCol4/oPGsQVv7W3QEAu6RQP2w7l78KIzP58MYQzDYSe2ghue6eMbQ091NqVQ6clPb32c5n3vuoOG0orZt9wJBz/PU0xOiUinjOA6u43LqndPW2uPHgIXjOljQ8Fz3J4C/AYYjmwptlW0cAAAAAElFTkSuQmCC";
			var newrutor_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAArBJREFUOI19k01sVGUUhp/vu/f7Zu50pjPWdtICgg0NMbHRxpBITDFRQwgLEyM73bBgJcYVG2BD0J2JW2KMXdVECCs1Sk2MDSiFUEgJ0MQfINN2Cp3STn9sS+feua8LY5UoPdvzvk/Om3MObFKrswNqLAxqM415UiOpHVblwg1Cb+nc00em/OkTtf+pxuQe/fJxQQNFo8F2q1sfRoonXth0EgDixVNaGm3RyNvoa0L9SKCxV0u6fbxXP7/jNDeUUVw/8v+gZOUtzV9E3/danSeryv5IDw86jXaEGju8XZNnezT0klPtHPqj8vzjEMV7de8M+qrbaxin6gc5acZr6buMKh1Ol0DTZ4qqfJTX2YzX7VNWcbXzL0gzeUZjp9GgtxrGavL9Fin2ai6FevBJTvMYLWB18w2v1csF/ZQJNYjRyAkrrZVl12c7YMbjGiGtxvHgUsrdL/IMv2spvWloOeSJgFJVJJElagvIEhC5iKlqO2Gu67qZHnCasiKrFK4b7h9KKSJuLcS8+LlnfRlcLSBcTEgeNSl6w66XA3I94yYEeGpXG9kdsyzfC9nWCdtfEabmmL7YYPxYwo4jnoJLWP7VsLpoyewUadkDYAGi/hmz5aBjnhTzXkTmS09wztB92lJw65iuJrn+hNkxWE9T8n1iXN0AhH9vomtfQP03Q3TAcf61R+Qt7DwO5f2OiR+a3PnG0Xs0T/Vb0fZ6hmd3XzXwr1NevN+u+o01rp5IKV2LKRJSJ0EupRkHrGLYdnIrrT2tdDw3RXn3nNmIAHBzpZfKSIP6tQYeQ0BCFwnlOKWTmHZSLp+sMDr0kELLhu2fCP09w6Z2pai7nyXMWUtsLQEGAocCy5oNKVlD34E8yZ2VDcBjHxZPlBTHTZQ4CD0pHh86UgxSiHXgswn26d83fH8CSvwzeVhuUJoAAAAASUVORK5CYII=";
			var nnmclub_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAglJREFUOI2dkk1IkwEYx3/vu9dtTsfC3tbadDNKZ1bkEprRB23hIegSNcrMKIKIunTrUtKhoO+IDhFUBLtEi+rgpSQlxEsysUOgSZnVsI8l6IaZ296nw3ZpfTD7w8PDA8/z4+HPHwCwbMMZS2G2+/k/OQIEPwi9b9KAdT6XpnyTKj6bj1EdMlNPkMH+aKkAFQCbfyOVqzPYrPDt0FbAPB+AwrJwAMfKMjwKZOtU1Ib98/ugdk87Dit4zRD6AdZwa6mAgkxb9I6RnD0lQkYE/+PpUi810LdTc/SiddOM2vggztCGZqZXrbcxgg4kAQWwY/E0gy+MM7iCA14XfRMTvBjo1lgXvclX3f3xjo52phqWg2J8Mqkob3MsPInmKye7YDdzVY2YfBbUvaAHoBUYS+zSMIbh8hHUrIl3taDEQcoeoppa7Dnn4Wt8T8OiNnAnYHMdODWwp4WuRz2MHz8HzoNx7uaEpyLcGhWWnOgvd0W+0HRbiIoo92elYue48ESEpAjdhsGOq8/A5sq7YHGECUUFz6kxNG8noAOL1cioMCvSkBPpnMkYa/ZFrnPpSozT956DranYTL1obuH8QJasiP7SkMiciL297Qb55P4SMq3Qk0WA19iWKqQhOSzEhhSYrDGAXKF+AxRriqn3KfoqK+jqnSTxKk7PhbP/DMQf5KY+3AGOtYDlb0s/AQFoqz9wpDO7AAAAAElFTkSuQmCC";
			var opensubtitles_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAA3NCSVQICAjb4U/gAAAAnUlEQVQokc1SUQ1DIQxs5wAk1AIWsABWagELWKgWLNRCkcA+upCw7OPlZVl2H017ydG7BoAbWGuttS42jzsbfoXeuxsVEWeIyMycNDMnXxmYGQAQERH3KCK1VkSMMc45j+dVlYi8DyGoqpM5589+zCyEsAVuIOfsflQ1pXQImLn3vsO01gDAqyt95wEReQs9xtihSylXLvct/NlfegLxtZUd3E9jfAAAAABJRU5ErkJggg==";
			var podnapisi_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAdtJREFUOI11k7uqWkEYhb+93VuS7eV0ksZOLMTGylaxsVA5YJPOQnyCNEr6iJ1IXsA3sAkiCL6AICgqohaCFwQb8QJekj+F2Yatnh8WMwwza9Za84/CrezAN+DCx6UDxcdF5d/4BVgB+Hw+otEo1+v1vknTNFqtFrqu7weDwS9FUb4+EnlCoZBUq1VJJBKyXq9lNpvdsV6vJZ1OS61Wk2g0ehSR9zu5OblcLmy3W5xOJx6P50m/qqqcTidardZnRVF+AjUA1dzgcDjw+/2oqvp0GKBSqVAqlej1eqZlq4LZbEa1WqXZbJLJZLhcrHkahsFms6FcLgP8ecogFovJZDKRZDIp8/lcptOpBcvlUgA5Ho8CnJ8INE0Tr9cruVxORETO57MFIiIul0sCgYCF4G44Ho8zHo/Z7/c3b5pmAcBut6Pf71vDNSeNRgO/38/b2xsAiqJYAOB2uwkGgy9D9kQiEel2u5JKpWSxWDxlsFqtBJDNZmOxcH+F0WhEsVik3W6Tz+ctnQig6zoAhULhtYJwOCz1el2y2ax8VIB0Op3XCg6HA5PJ5H7zYx+YCobDoWXdJFBtNhuGYdDpdKhUKk8W7HY7cGsobj8T+P8bPwE/gNNLg9ZSgN/Ad4C/TzwSV9SVxC4AAAAASUVORK5CYII=";
			var rottentomatoes_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAc1JREFUOI2Vkktrk1EQhp853y2R2IIo3lBRUZrGjb9AoYp/QKFQEDeioDs3bl0UpRRLl65EQdy48BeoC1duTEWrNVAVEZVIa0lq813OGTdpmuQjtH1Wc5h33pk550A/08enmB19B8DkngtMHbyc03Th95zuHRhHxANTYab8kmJwltgtw4/HgwykE82MviLyz+AUnIIIKKDuDyIWwxK+fcH1jze7DcxGtPqILPvUtlVUOZW6FM+UrvzLdj+vNU7Mv/574/e5ofe5CS5OHpseigq3FgW9s7CSfN5V4OrRUvTr2bd074dGQNHgQkE9gwmEFF2N3rZKHYOsEv70WroPp2BhduLI2tjXplepLodpwctfnIB1rhZW45OSlL27wY7oduK0IwjWLM4XbGByxeuERkjq8SVfA/+8Ve1JpsV8136cKjJsJgyG/X31W0IBFXPICGzebjCeUaUusrmyHwHEue8Ga994bN/BiGAb9qkAxKeLiYHAbbHYF7DWLYRz8YgBkJX4mifC4EfbIBDInDbDuXgE2l85XHQP43pr3Kk2QyN4Qs9Spt01NELq3HxUbe1cz+WWT8refQ39MUQOIzIMpKK6hHM1GtmD8It70q3/D6WKrgmCznUMAAAAAElFTkSuQmCC";
			var subscene_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAA3NCSVQICAjb4U/gAAACBUlEQVQokU2Sy0vUYRiFn3dmoCIaUwgXlUEjXUydFg5RKghKBF2IapFRbSOSaBtFiyCENm36D6Jl0CKDIBfZfWFkQrgoiCG6aF6brKF+57T4zUTf8uPwcs5zTmw4eYX6sx0YGxvJQRgrCWzJVuBcTRdhO6yaGmxjTIINTtXIOdsAVtjYjatXXjy+b7C/tFD5ef/FxPCte3OVH4aQsGxlG4p9gZFSV1dPHxjsL5W/zlZ//+7p3LKpuene89chB05d51DyLwH2YH8J2DM0HPjcob7bD18ig2ysBMjUpJIloPx1Frh+5pikm3dH55e+Y9US2+Ekm2/vRUqThJOZ+aX9u4sdmzfs7dox8vjVz+ovMHbYtQxr2ruxsQJhTZU/zcx/H+ja0dzU0Ltz28jT17+q1VCSgkLK5tu6sVLSQKA378rTcwsDpY7mpobO1o13Rp8BdoIMzgA1Sk5If61bD57sv3AN6CluK7a22IklMFImnFiSZWLtyhWXTh0cOro3pIn3H59MTAH51auQIu3Syin5EzhkrM5C4eyRAaBlXWN6frGyPDY+iU1EijWb374rJR3w4fP0t7nFUluh1FboaG1ZrCyfuHzjy8wsYJQWEOsPnwdR7yWUAL3FrcDY+CR1J+nAUJIDWfqfNNKjV2/DCdSvWIClyETOUqRDsmxZDuqzTT1gsOVU8hd6pofIlPFCzAAAAABJRU5ErkJggg==";
			var yohoho_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAARVBMVEUsO0dXZW9zfoXN0dMgMj8kNUMXKjgrOUUtPUowQEyYoKZib3iKk5mmrbHt7u6yt7rY291IV2IBFiXa3+DAxMc9S1f////MB3BLAAAAAWJLR0QAiAUdSAAAAI9JREFUGJVVj0kWwyAMQ81kJAKZ0/sftS6QRbE3+g/bkuSc5X35J6whAmASsYom04usHy/EQnIgEe5OfcgSwaG1bLp7dZXSvyAfoYbo9u2WPgTG8lm0tfP2kR0kdyEFr7XpBMtFA2crHYiB1caCW10aW9NRCG5rTeOu3TELiGZkerU1gBlllzMsRpae9j//F/zoBZecZUOYAAAAAElFTkSuQmCC";
			var youtube_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAJ9JREFUOI3FkkEKg0AMRd8E0Ru4c1/0BoJn8XD2GO6E3kBx784bCGq66NBVaKdW8ENgyJ+f/JDA1XBWUqEEbsDuUwKMDh5mFYVGYVXQwFgVmrcDBT1o34lCfUTsG9cCZCbbddD332pkAqQmtSyQ56+J2xbi2PqVSrhhGxEwm0ySwDBAUXzSzxEwmVRVhRiY/l+jf9+B7Qft5jUnnfKleAL5LDy9WUKyUwAAAABJRU5ErkJggg==";
			var icheckmovies_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAsNJREFUOI2Vk09oVFcUxn/3vTeZyUyUCWlip40mkagjYyZNa0XRVQmI2QRdlKg7FWKRLMxCupCQmP4VDHQRRFyUgIWEggt3bgqVEgtdOJpM0qYETTJqRJEYk/Tdefe+42Kc6MKF/eDAhcv53ftxvqNEhK6uLjHG8H/keR6jo6NKdXZ2SjQaJQzD9UsRwRhDGeq6LpFIBKUUCIgC4zpk5pfwAIIgIAxDlFLr55070zQ3b8VxHObmFpiczGONxYtVoATa889JP1rFC8MQEUFE0FpTX/8xPT1f0dKSwXVdRACE2dn7XL76MzO5Cb78Z5mPXgaMtVSjOjo6pPyLVOpDhoZ+JJlM4vv+G8MC0ao4Lx4/4bd9x6l6scbYJ7UsJBwcay3GGLQu0t19ipqaFEUFTqxivV95LnpljemjX7Ph+Qq/ttYwVwmuNiWA1pqGxi18tvtT8oM/8efeYyyO3cRLJOA1LH/6Ak9/v03ryHfUfbEXs7yCsQbHGIPva2prP6DCjaIXn7H8V57Jk308vHaDWLyaB5dGKPxynaazJ0gdPkRj3SZ8XcRai2etxVqDNRZcITPch4p4LAyPMnNuCAkMs4NXSLa1su3CGcAQhiHGGKy1JQsiQqFQoKg11v+PHT+cZePnGczLVaZ7vicsBuy42IubiAMhMzP/IlKCONZaAKan/2Z8/DbxWAxVEWFb/xlCHWBW19h0pJ2a9n14ttR869YfuK6LtRY3lUr1l2xYcrl7HDzYTnJDFV59HcHSMsk9WbZ/00MsEccEAb2955ifX8DzvFL42traJAgCRATf1zQ0bKa//zwHDuxHqejrQRomJu4xMPAtd+7kqKysRClVqmw2uw4oB8rakGx2F01NjTiOolB4RC53F2MM0WgJqpTCcRxUOp2WcpTfVhAE716mcriUQkRQIkImk5HyNN5H5denpqbUK4/AbeANHapAAAAAAElFTkSuQmCC";
			var metacritic_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAntJREFUOI1tk09o23UYxj8/xGHRdZatHpx4Gy50TfJr+kvS4lHQm0w8eRGRqXjx0oLU27pT/0yG8ywylQ1xrGixjIoXC7ZNti4rBe1MU2Ezpg7qMghdYz4e0iXL6Hv+Pp/n/fI+T8A+Yz6cp1G/x9NPnkRgp7GB/B6kVl57/G3QIfw1NkLvwUnqO6yuP0Xlr4BGXbqP1Em9BE8cFLaCn4J0/pV9XKOKGwkXLqaFSEgKCAeE4wJ+MTGkpbjmo0qneDk2YjHhhekhod9oMLL3uV7PTk/7cK7lcwJ+9HZGS/26lJpvA9az/vZjJMTNpCNjx5uOqpVKxfvVqqrlclnACxPDWgx1MTaGiyfGLPXZ1zfkwEAk4AenTjlz5Yrq3jdwe3tb1Tu3bwvYKKQ1l5jFfHzun4WskPT5o0c9c/q0j85n5861IP/uQWa+n/PnL9F8WMR8fPbmD1nhBQGXl5b8u1z20qWLLcjU5EQLMn/1qoCXp17WtaSYj8/emEn4+pvvtAQfj44KOD7e3ubz8+d99vDhJujFlJenhnUtFPPxubsLWQFvrFxXtVqtthzPjI+runqzIGAmioSEi9+m9VqyiIuxMUsnzAwMNyHXm5D7j0A+fP89AdNRZDoaFEL/K6Q0l5gNHp7xVrHOsVfrwAqrhQJ9/f3UajUGw5DdRoOeQ4cggKXlXb6e6uKtNx7AVu2TdpA2k37z6VArgZulksU/bu05D+45Jx19N62bjwUJwF+SI/4ZmvsuEjKt9ekJhYSQ8quz2aY4145yZ5mWYyP0dE9ijbX1Lu5WoP4goPuIDBzbJXgmgC06ytQBaBcrnMf6PboOnARhxw103zr/D/u22cLku3pbAAAAAElFTkSuQmCC";
			var themoviedb_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAASFBMVEVHcExSwb1kw7Nyx60AADYBAiwBIT8VMUgCJUENLEcZtdc+vscxvM0ludRAtb0pschpq5QNvOcBDzkDfaRbjnqI060MnsULlbo1XZwLAAAACHRSTlMA////////2+nJsOMAAAABYktHRACIBR1IAAAAW0lEQVQYlY3PSQ6AIAwF0KKlLaiAON3/pqLEBNQFf/mSDh+ATREGYKnCYGowbYCIOucGwtB3yjnv7REpAa5bAjWMk50X/QcSwwM7XSNCmJOWUnGW2h/7lHvXPwFXvQgnNCMwUgAAAABJRU5ErkJggg==";
			var mrqe_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAulJREFUOI19k01MnHUQxn/v7nb3hTbFBboJWKAVo8VbW/ohsdkgUZSDISSGS0Oaqol6M208mGA5eDIxwdZD2YOaEFsaIpq0jegiUpqmH9TS1mBdNrvBCG2lfDTd72Xf/+MBaAlpfJI5TeaXmWdmkMRyGCTnpFHOMVqaMUZTkjqe5J8eLpZ1CKxmsMhlC8zPPdqcSTv5sSt/hVJJTgAtQBkoCPoI5F6pewy4CJQmEqn3IpEox788XtzefrD24WJ+w+GDH394Y2z6c4ldwC5gE1hmPWAn0BaPxwiFQrjcwrYtrl0fpqTMx6m+r+v++Xt2UMb6BPgD0HpA1fT0dMvIyAiRyQjJVJJt2yu5fuMif07+xv699Zw7O4IRpSL9mdaN4AZq79+/Z6fTGep31/N87Qv4fF6Kij28824H47fGGQqPAiyJQp2F5VoLaAPK3W5PLDz0M8aIcHiIyspqyssqGPj+LPfuPqRqazXG4a6MzVp5gH0Sv8/MzLz95hstSMLvfwbkZX5hgXg8TsmmKnYfeA3LRcGyCoCPtR3csSzsouKi/JWrl4lGo2SzeX4J/8SevTt4/4PD5HKQSCQcj0fbVhawGfCCvC7ABqqbXm36t8gupqamhuhkjIqKcn784TyOs8Svw+dxe5SYm5tNu9h4CfQtcBp42d3V1TW2YuQrfr9/y7Wrt0glkzy3vY75B4bAlq3YPi/jty/ZPT09vlQqHWhoaJgCMmB9sepmOdDW2NgYCwQC2fo9+3npxX143aWYwkZOhk4wMHCGY8c+pbu7247FYo1ADKhZvekGSUHJdEimP53Ozp7+7pxzYfimk88pY5Sbkszs6OjoQmdnp2OMjkpql7RzFWA9eShjScYtacNSXg8kM+k4Waevry/S339mQVJLIvHotqQLkkos6fFVPk1ficJbyUTm2WAwSGtrq7O4uJibmJgoPnLk6FRz8+sH/vdVl0eSW9Kp3t7e7ODgYErSN5LuSGqStOM/gdDDLy4Rne4AAAAASUVORK5CYII=";
			var thetvdb_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAiRJREFUOI21kT9oE2EYxn/f3eUSr9G0VdLWYkzSnvGaRSRLh6JU61/QwUGKoEIQCbpoERQsWqhuCo6Ci2jRRSkIRRyq4NQMCi4Vo9IWraapWGxyl+Ry/RxaKy5mEN/5ed7neX8v/OMIKSUtLS0DQhVu/kv+r+JoNIrruqiqim3bWqFQuCmSyeT02w+5iFeuMnrvEZGtUTRVQwgBQM3zqBUrDJ6/xNNXz7EsC8/zkFLi8/nmhKJr5YFTZ/0Xrl3mdvY+g9k7UJmFJWc51reBvk27GO47hzP5jZ17e1cbmaZZEcDiXOl7MHy8CbosUIMglN+9pQTpwtRrxq9kGb/+kLbtnQT8ftLptK0c7tkncp9ysBnQ1v1pBhACFB1iKXpHL3IofRRFCAzDABDawf0HmC8vgm7Uwa1CYZzmxmYymQwAlmWhBdc08NmdB9FY/2c1cGybsbExwuEwqVQKzavVaFADIGv1FwgwDIOrQ0PEYzFaW1tRJj++I6aFYWmujltCYC122SE7MUE+n0fXdQSw+L44G+zMbIQt3cvUV/S/UgFwprmxe5jOryHazAihUIhEIuEIoPjy2YuGN9oUZ0ZOggb4V4xy+W5cINbNzOnHRNa3rXZKJBK2ME2zksvl9Ad3R+jZs4NiYIkfxYXVBnrAT5MWpDSzQNe2JPF4HFVVURQFx3Gk1t7efqtarR7pP3GsLsWOjg6EEEgpKZVKmmmaT+qT/9/zE++UuSqjFWjkAAAAAElFTkSuQmCC";
			var subtitry_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAEhJREFUOI3tkTEKACAMAxPp/78cJ6GkaFcRb07ag1CSkCCJHRYFSUYuSSohJ2cBIPxyZ+APxiqdim6Qs8Wg4z6Dv8INBg+sMAFG+1U9kwkyGgAAAABJRU5ErkJggg==";
			var rarbgmirror_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAflJREFUOI2F0z9oXEcQx/HPCSWY22DcvFe4CK9KoYOQIhZxE1/j5lQLUpig2lIVIhchsY1xZadIYR8uXKhXfZUhnFOeXAVOhBDCI+XbJjHsEozRpjid/OdsMrDMsMN+5/eDnV4ppYePcQ0f4cRq/IWf8cdKp5RyuZTypPx//FNK+aGU8kEppbc86/gCn0/nnfFBS3hzQB9VFWwNq/PDQX0HF/Dtsr++LFKijVk/k9NbMtvs6VG0v8P2sL6Ox/jtDUBAPyzypUFl60oFJkfR8XGUMJm2RsP6XODLFQCE/iI3DcPNGk42mnptbzwjZRmpI9QurlhYqng7ck76MqgCoQZ/vhOwpMQumc46Kee16VEnp6SLjIaVwHP88h5AInEUo8Onx2dXsD3asLM1gAdoVwApZ/PjVkpZXfc1/WDexoWo0F8+fo6D10eunXlNSdu2Yuxc2qhNDnZsDRsxdmJs7d4/hPP4CR+uABZaMykuPgXu7Y8MmiClbDqZ2r19CCPcfAcgyynKOUsL4y9DCP8+uLcjnMLH40MPDybwHb7G+hkgZcSO1Mk5w9+4uzloXtza35bzord3Y2wyncEdfNUrpVzF3a5Lm23bymjqStPUv+Iz/IhvZvM5iYwqBINB8zu+752u86e47tU6n2CMmcU+3cAneHlq+wUe4dl/EuoEoSZWymEAAAAASUVORK5CYII=";
			var kickasstorrents_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAA3xJREFUOI0l0ctPXFUAB+DfOec+5zBz5ynvMhSQNCSgobRqtJHoBok0VJOqqUkXPjZdaDGujYkrNxpdGdOdSU3VhWlq1WhDg5W2obTBltFSSng0CAzDzFzmPs85Lvz+hY+pEkdPF395Z1d++8qYk5s6ncyOP+8M6Ub0Nrdw7kAbfffkOKfXvukJPzpbzBXb8EKt7n926njCnv7x9BxRSz3O+FvrXweR9SqjJPCD0FMA1ZnGEwmTSSnh7vsNQO7EsRCMsYyh62mNxTcuf5V/nQ30YHT2jjqbTfNEImFojsOtbLrJ1DVGlZJIcgMJW9elhHOwWMikUralFBBL5O7dD1e1C5e8CdNMZJnGwBiDYWhw6z7yhSROnBhB94E0hBBw3QA8lcCXX/yK6p4HyzSsu8veGGsuaJ/wpkSrqeswTA1SApxrmJgYxs1b6/jjz4dglKFQSOG330uYn18Fb7KglEK1FtpaGKPAKAVlBIauo+56GBxox/nzs6i7PuJYIdWkYfpqCWtrFeTzKcRxDBELCAGHQgEEAKUUjDEoKIhYYbfiorklg8njQxgdfRz1+j46O3IwDR2EEIAQKAKpAaospGojhAAAKGHYqwZ4YrADhq7DMDRwbiGOBAglUAIACKQEIFWVakzM+0GklFSQUoJSgpnZZWzteFha3oZGKZyEDoCgXm/A8xrw/QB+EIFQsUI7m+Xl/YZfCyMB1/VBqcQHUy9CygibW1UMHGqBH8Tw/BAbj8rg3MTThzsgZRQnbVyj77zhzMg4Wijv1rGxWUZfbwsOj/Qi8GMce7YPvf2tuHL1b0hJ4Dgcd0v/Ip3iOPZUsdrdhWntuaPpWi7tb1CNoaszj4crFZRKmzj52hF0H2zBhR/mcemnvxDHMWhIkE7qsEwGJ2nJZ8Zsl5w5ZX/cCHPvTY4PJVNJE3N3HuH2Yhkd7WnsVVxYBjA82AYhJMJIwElZSDs2fr5yb3Ok7/6ktlultUp9v76ytpcc6C/gycFWPJbnKC1to7fLQW93Dpwb0Nj/Sw0vwvW5VWxslG99+v6RZe32A3auLdPwv7+4MOUFh4q5jKUu/rLobW27JiGU2baBbNpWjmNFSilRrXrVnUrtRntW+5z0X98m6sEwXjpTTW2vL79pW/zDbMbE6lrlO12nfULgqIKyKFGLQmChEQg38vFPGGNmfQslANF/ELGRK2tf6tsAAAAASUVORK5CYII=";
			var thepiratebay_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAA3NCSVQICAjb4U/gAAAB+klEQVQokX2STcsxYRTHr3khk9fxmigllAVSXrIjK3vFRsmCDZv5CBZ8CfIBLIiVhRQWZqEsKBsbq1FSk5cmzeU8i/H0uNX9/DbXOXX6n/M/1yEAAP3lM/6CIAgloJVnv99zHCdJEkmSX6WKSrVaLRQK7xwA+v3+b9oK+XxeqXx3oOl3oFKpMMYsy2KMr9crQuj1egGAWq1WCn4MEAqF1ut1qVTq9Xo8z1cqlcFg0G63P+3Rn4MyDGOxWJ7PZ6PR0Gg0sizX6/Xtdqv0+ecJADqdjpIajcbPnnq9nqIohFAikXg+nwDwvRNRFD0ej1arRQgFAgFJkjDGCKH7/f72sNvtOI6TZVlRSiaT8XjcZDIhhFKpVDKZZFkWIWS322maxhgTs9ksk8k0m02dTudwOFiWvd1usiwrozIMQ5IkSZKxWGw0Gi2XS8rlci0WC+XvLpcLRVHxeDydTkcikXA47HQ6H4/H8Xicz+etVothGGIymYzH4+12W6vVNptNt9s9n89Wq9Xv9wuCIEmSz+dzu92n00kQBIwxAQCCIASDQZPJ5PV6bTabwWAIBAKv14vn+f1+b7FYotHocDjMZrPlchkBwPV6NZvNHMeJogg/EUVxPp8Xi0WE0Gq1AgAEALIsT6fT8/kMv3A8HnO53OFwAADiPyf9CQAoF/4HStItR7mjWFIAAAAASUVORK5CYII=";
			var netflix_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAWVJREFUOI2Nks1KHEEURs9XPdO2jqQNziBBDISQhXkHdz6Ca1cBn0lwl2SXhSjZuXLtJpsQiCAJwST+4IAMTOju+lzYhpmMk+m7u1V1T51bdWEkPqVP311kXf/Ill1mvf7D+n47Pz1Mc39Mcx+k+fvRmjCafKZUhQG4wbmz3hYzYgyQAr9sAlBgMDsTh/4HSAicuyIAEejLm+Y5JbXWLEAAbg0Dg4ACYG7wZmCXagIAWBCc1RYFBmn7Z3TRyACgBZzFSMK99yVsrBGyqimAuvC3jYCICYFXwzpvBHgi+BIrEqACXicJN378HScABuYlYuWvAWFgRUKP3j/FIAG+4WEPjlVbvAiBsikAYCUoxX7bRkTgZQh/v3cmwMCilPCns9eu8w5iUZMTNdWgDRLfWbKOHiZzVQkFcTpg1DDi+z2xm9ZtPJMYxvEuWv8k5RK6yqXrvuMpgIaXH5x1TyB0gO56aI0p3AERen4ZCZoRgQAAAABJRU5ErkJggg==";
			var ub1337x_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAfFJREFUOI3Fk79rFHEQxT8z393bTaKgSUAUjlMUbFTsbGxEwcJUamMpgoVami5WIqlirSiksLEQQQsxf4IoGBVBRBJMxMvh5ecle3t3+/2OhYlGLlYpHJhhmnnMe29GzIzthG5rGoh+d1eOXmBn/y1UDZGYxtI4rWwMF0MpPcXgvlFcnOI05fv0E+69HvkbIM/e4mI3F+IjJsreJL1OO39M8FXSvmv1vDiBGuLbYSDP3nRT8H6KbGU4taKlFqi1OUAUn0f15DLx0IZWAz67jerzbgpRBMbELjpPq14umRn09A2jbjEPlmqkDGrnI2vL9xEJ3QC2Xltro7sSd3Yh0F/raNmcK2sSoZ28oDo1RiurIn8W30Sh+JVF8aGnaD5wLgIRNHKExiIDX9+/Ym7mEasrsLK0hQtZA8ygd4eS9pUJgs9WsdoCfnkeovYgIrvptH9stnHTHRgIUHRO1+r1i+1vX+jMfqaYryEizBSlw5SSGzgHzm0B0GpCK09oNm4267WSZQ0qSZis9OqLDQeCcRmRg4j8QwPz52abdkbUYaLg/V18MZJIWLMQmG1RBq5iwXUDYIcQvRNAzYz9KZ/AXqL6bk/EBCIE75nOZRhjqFtEdcdwLq+kNgkS44uHIOuC2XgloYLhcFGKt+PAMwD579/4E9XT4ppxJtWQAAAAAElFTkSuQmCC";
			var duckduckgo_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAv5JREFUOI1tk19oW3UcxT+/m5ubepP0bmFZSlK9s03nv6bbCA4VnYgvvuqQtfZB8UknhTkHFqSITLDCSufLZIJDfGnGoD7WB1EU/4BtV83ajXZZbdL1tmnpatYkvX+Se30IZFP7ff6ewzmccwT/Oa83HieUGCZ+MF1uS+oAobVcHmNhmvLKoMgYxv3/ogk8dQQ2zLHtV870si+GVfgLe3EWgECyB0XvgKJBeHwkQzTQJ87P3CPwTh2Bv6Vs9fSF1NaVi/hCe7HmJ3EKfyBpD4Ln4lkVAt3HiPQPoI6+dQ2NHnF+BgmADXOsevpCau2j13E3iwSfehH9yx9p//wXJFkCz0MKR7Fv/Unx7JtU372YYsMcAxBebzy+/erZldLv32PPT6F0pWn/9GsQvqbP4rkzVH6bQCgP4NVslM5DaEdfIHxlKCERSgwTi2PN/YznVIidHOJGodQEV8wavjc+AHOz4VlWsGZ/glgcQolhifgjaTu/iFBUqDvIWgS/8Lg6twxAsEXmk8uztD59HLdSw92REP4gdn4R4gfTUrmtU7dyWZD84FOwiwaaFiSyJ9hUMfLOk0iJEtETqzz0/hzyHrBuZim3JXX5X5nKCjtLt4g+epio1gJ2Ae+mjr0KwYehcqOT25+14zk1ZNHIUAqt5fKBZA+4DsgtmNlf72N0cU3Y/PYJ1i+nqN31oaZ28GoOgWQPodVcXsJYmFb0Djyr0lBw9bt7BP4DLH34OFLIIXy0jBAe1awK9WqjWMbCtER5ZZCiQaD7GF69hru1jFu52+QIH34GeypA6ZsI25ManmsT6H4OigaUVwYlkTGM8Pi5TKR/ACFcEH7qiznGcl/ww+0Jpp8/wMRLKl+9pqFYJkK4RPoHCI+PZETGMBpNjLb0qaMnr8WGLqE89izm/HU2nTt8PPU2o06GeV1lx9lC6TpEbOhSo8rRQN/uY3r5vV5/VzeFhEqbfy+t4XZqM5PYpSL1rfXdx/S/Oav7h9nXmS7v79Bd6rTeWc6zvrTrnP8Bts5CMBEjpA4AAAAASUVORK5CYII=";
			var torrentdownloads_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAA3NCSVQICAjb4U/gAAABF0lEQVQokZVRS0oDQRB9hl54DrcewAsEL+ABFEEJQVAXycatIujCiBBEt269QcCbuBAXrmdiV3d9Bhed6UkmCmPRi0fVe/WqujbGb4z/hBOz/tZmR/bsPfTYrHt7NnNRNVrVURBVXRQlrQBM76at8vB82BaIuij6LRWA/ZMBgMfbCYDB6AxAyrcFQXTOzRreewBztten55zcOz5KIIj2SKRky897770v2YgCUdg9OCQKL/cPqUoiLogWse1QRFsHycEFkSJqFhARgCJqzWsAgLBwWNqBmQEUXDdeAtlhZaT+xU0aoLZqwEIQVUv+5djJanY1BrAzuk6cqOpYV741x/bpZcaZwKqO1dYP9FewmhOzr8+PjgIAPx5kA+4lu2i5AAAAAElFTkSuQmCC";
		/*
			var fvico_img="data:image/png;base64,";
			alert(movie+"\n"+year+"\n"+movie_ru);
			alert(movie_enc+"\n"+movie_imdb+"\n"+movie_hdclub+"\n"+movie_nnm+"\n"+year);
		*/
			if(!jQuery.browser.mozilla){
				var url2db = 'http://www.omdbapi.com/?apikey=' + API_KEY_OMDB + '&t=' + movie_enc + '&y=' + year + '&plot=short&r=json';
		//alert(url2db);
				GM_xmlhttpRequest({
					method: 'GET',
					url: url2db,
					onload: function(response) {
						var data = JSON.parse(response.responseText);
						console.log(data);
						if (data.Response === 'False') {
							if((movie+" ").indexOf("s ")-(movie+" ").indexOf("'s ") > 1){
								var movie_s = (movie+" ").replace("s ", "'s ")
								var movie_encs=encodeURIComponent(movie_s);
								url2db = 'http://www.omdbapi.com/?apikey=' + API_KEY_OMDB + '&t=' + movie_encs + '&y=' + year + '&plot=short&r=json';
							}
							$("#loading").detach();
							$(".toli").append('<a style="margin: 10px;" target="_blank" title="IMDB" href="http://www.imdb.com/find?q='+movie_enc+'"><img style="border:0; margin-top: 3px; margin-bottom : 3px;"  src="'+imdb_img+'"></a>');
						} else {
							/* получаем полную информацию  */  /*
							let movie_imdb = {
								imdbID: data.imdbID,
								Title: '<a href="http://www.imdb.com/title/'+data.imdbID+'" target="_blank">'+data.Title+'</a>',
								Year: data.Year,
							};*/
							if(data.imdbID!==""){
								movie_imdbID=data.imdbID;
								$("#loading").detach();
								$(".toli").append('<a style="margin: 10px;" target="_blank" title="rarbgmirror.com" href="https://rarbgmirror.com/torrents.php?search='+movie_imdbID+'"><img style="border:0; margin-top: 3px; margin-bottom: 3px;" src="'+rarbgmirror_img+'"></a>');
								$(".toli").append('<a style="margin: 10px;" target="_blank" title="iCheckMovies" href="https://www.icheckmovies.com/search/movies/?query='+movie_imdbID+'"><img style="border:0; margin-top: 3px; margin-bottom: 3px;" src="'+icheckmovies_img+'"></a>');
								$(".toli").append('<a style="margin: 10px;" target="_blank" title="torrent в Google" href="https://www.google.ru/search?hl=en&lr=&q=torrent%20'+movie_imdbID+'"><img style="border:0; margin-top: 3px; margin-bottom: 3px;" src="'+google_img+'"></a>');
								$(".toli").append('<a style="margin: 10px;" target="_blank" title="Gdrive Player" href="https://database.gdriveplayer.me/player.php?imdb='+movie_imdbID+'"><img style="border:0; margin-top: 3px; margin-bottom: 3px;" src="'+movieposter_img+'"></a>');
								$(".toli").append('<a style="margin: 10px;" target="_blank" title="IMDB" href="http://www.imdb.com/title/'+movie_imdbID+'"><img style="border:0; margin-top: 3px; margin-bottom: 3px;" src="'+imdb_img+'"></a>');
							}
						}
					},
					onerror: function(){
						console.warn('request failed: ' + url2db);
					}
				});
			}else{
				$.ajax({
					url:"http://www.omdbapi.com/?apikey="+API_KEY_OMDB,
					data:"t="+movie_imdb+"&y="+year+"&plot=short&r=json",
					jsonp:"callback",
					jsonpCallback:"callbackName",
					dataType:"jsonp",
					timeout:6000
				}).done(function callbackName(data){
					if(data.Response=="True"){
						$("#loading").detach();
						movie_imdbID=data.imdbID;
						$(".toli").append('<a style="margin: 10px;" target="_blank" title="IMDB" href="http://www.imdb.com/title/'+movie_imdbID+'"><img style="border:0; margin-top: 3px; margin-bottom : 3px;" src="'+imdb_img+'"></a>');
					}else{
						$("#loading").detach();
						$(".toli").append('<a style="margin: 10px;" target="_blank" title="IMDB" href="http://www.imdb.com/find?q='+movie_enc+'"><img style="border:0; margin-top: 3px; margin-bottom : 3px;" src="'+imdb_img+'"></a>');
					}
				}).fail(function(jqXHR,data){
					$("#loading").detach();
					$(".toli").append('<a style="margin: 10px;" target="_blank" title="IMDB" href="http://www.imdb.com/find?q='+movie_enc+'"><img style="border:0; margin-top: 3px; margin-bottom : 3px;" src="'+imdb_img+'"></a>');
				});
			}
			var link1='<a target="_blank" title="RuTracker.org" href="http://rutracker.net/forum/tracker.php?nm='+movie_enc+" "+year+'"><img style="border:0; margin-top: 3px; margin-bottom : 3px; width: 16px; height: 16px;" src="'+rtr_img+'"></a>';
			var link2='<a target="_blank" title="RuTor.org" href="http://rutor.info/search/'+movie_enc+" "+year+'"><img src="'+newrutor_img+'"></a>';//http://g-tor.xyz/ http://xrutor.org/ http://rutor.info/ и http://rutor.is/
			var link3='<a target="_blank" title="NNM-Club.me" href="http://nnmclub.to/forum/tracker.php?nm='+movie_nnm+" "+year+'"><img src="'+nnmclub_img+'"></a>';
			var link4='<a target="_blank" title="KinoZal.tv" href="http://kinozal.tv/browse.php?s='+movie+" "+year+'"><img src="'+kinozal_img+'"></a>';
			var link5='<a target="_blank" title="allmovie.com" href="http://www.allmovie.com/search/movies/'+movie_allm+" "+year+'"><img src="'+allmovie_img+'"></a>';
			var link6='<a target="_blank" title="yohoho.cc" href="https://yohoho.cc/#'+movie_nr+'"><img src="'+yohoho_img+'"></a>';
			var link7='<a target="_blank" title="7tor.org" href="http://7tor.org/search.php?sr=topics&sf=titleonly&fp=0&tracker_search=torrent&keywords='+movie_enc+'"><img src="'+i7tor_img+'"></a>';
			var link8='<a target="_blank" title="OpenSubs" href="https://www.opensubtitles.org/en/search2/sublanguageid-all/moviename-'+movie+" "+year+'"><img src="'+opensubtitles_img+'"></a>';
			var link9='<a target="_blank" title="Русские субтитры" href="https://subtitry.ru/subtitles/?film='+movie_allm+'"><img src="'+subtitry_img+'"></a>';
			var link10='<a target="_blank" title="Subscene" href="https://subscene.com/subtitles/'+movie_subs+'"><img src="'+subscene_img+'"></a>';
			var link11='<a target="_blank" title="субтитры в Google" href="https://www.google.ru/search?hl=en&lr=&q=subtitle%20intitle:'+movie_nnm+" "+year+'"><img src="'+google_img+'"></a>';
			var link12='<a target="_blank" title="podnapisi.net" href="https://www.podnapisi.net/en/subtitles/search/?keywords='+movie+'&movie_type=&seasons=&episodes=&year=&type="><img src="'+podnapisi_img+'"></a>';
			var link13='<a target="_blank" title="Movie Review Query Engine" href="https://www.mrqe.com/search?utf8=%E2%9C%93&q='+movie_enc+'&commit=%C2%A0"><img src="'+mrqe_img+'"></a>';
			var link14='<a target="_blank" title="The TVDB" href="https://www.thetvdb.com/search?query='+movie_enc+'"><img src="'+thetvdb_img+'"></a>';
			var link15='<a target="_blank" title="MoviePosterDB" href="https://en-ru.movieposterdb.com/search?q='+movie_allm+'"><img src="'+movieposter_img+'"></a>';
			var link16='<a target="_blank" title="Rotten Tomatoes" href="https://www.rottentomatoes.com/search/?search='+movie_allm+'"><img src="'+rottentomatoes_img+'"></a>';
			var link17='<a target="_blank" title="The Movie Database (TMDb)" href="https://www.themoviedb.org/search?query='+movie_nnm+'"><img src="'+themoviedb_img+'"></a>';
			var link18='<a target="_blank" title="criticker.com" href="https://www.criticker.com/?search='+movie+'&type=films"><img src="'+criticker_img+'"></a>';
			var link19='<a target="_blank" title="metacritic.com" href="https://www.metacritic.com/movie/'+movie_subs+'"><img src="'+metacritic_img+'"></a>';
			var link20='<a target="_blank" title="Google" href="https://www.google.ru/search?q='+movie_nnm+" "+year+'"><img src="'+google_img+'"></a>';
			var link21='<a target="_blank" title="DuckDuckGo.com" href="https://duckduckgo.com/?q='+movie_nnm+" "+year+'&ia=web"><img src="'+duckduckgo_img+'"></a>';
			var link22='<a target="_blank" title="Wikipedia" href="https://ru.wikipedia.org/w/index.php?sort=relevance&search='+movie_nnm+"+"+year+'+film+%D1%84%D0%B8%D0%BB%D1%8C%D0%BC+intitle%3A'+movie_nnm+'&title=Special%3ASearch&profile=advanced&fulltext=1&advancedSearch-current=%7B%22fields%22%3A%7B%22intitle%22%3A%22'+movie_nnm+'%22%2C%22plain%22%3A%5B%22film%22%2C%22%D1%84%D0%B8%D0%BB%D1%8C%D0%BC%22%5D%7D%7D&ns0=1"><img src="'+wiki_img+'"></a>';
			var link23='<a target="_blank" title="youtube.com" href="http://www.youtube.com/results?search_query='+movie_nnm+" "+year+'"><img src="'+youtube_img+'"></a>';
			var link24='<a target="_blank" title="kickasstorrents.to" href="https://kickasstorrents.to/usearch/'+movie_enc+" "+year+'/"><img src="'+kickasstorrents_img+'"></a>';
			var link25='<a target="_blank" title="thepiratebay.org" href="https://thepiratebay.org/search.php?q='+movie_enc+" "+year+'"><img src="'+thepiratebay_img+'"></a>';
			var link26='<a target="_blank" title="netflix.com" href="https://www.netflix.com/search/'+movie_enc+" "+year+'"><img src="'+netflix_img+'"></a>';
			var link27='<a target="_blank" title="1337x.unblocker.cc" href="https://1337x.unblocker.cc/category-search/'+movie_enc+" "+year+'"><img src="'+ub1337x_img+'"></a>';
			var link28='<a target="_blank" title="torrentdownloads.me" href="https://www.torrentdownloads.me/search/?search='+movie_nnm+" "+year+'"><img src="'+torrentdownloads_img+'"></a>';

			var post='<div class="toli">'+link1+link2+link3+link4+link5+link6+link7+link8+link9+link10+link11+link12+link13+link14+link15+link16+link17+link18+link19+link20+link21+link22+link23+link24+link25+link26+link27+link28+'</div>';

			if($("[class^='styles_posterContainer__1w5Ik']").length>0){
//				$("[class^='styles_posterContainer__']").append(post);
				$("[class^='styles_posterContainer__1w5Ik']").append(post);
				$(".toli").css({"margin-top":"5px","margin-bottom":"5px",width:"300px"});
				$(".toli a").css({margin:"10px"});
				$(".toli a img").css({border:"0","margin-top":"3px","margin-bottom":"3px"});
			}else{
				$("img[class~='film-poster']").after(post);
				$(".toli").css({"margin-top":"5px","margin-bottom":"5px",width:"300px"});
				$(".toli a").css({margin:"10px"});
				$(".toli a img").css({border:"0","margin-top":"3px","margin-bottom":"3px"});
			}
			$(".toli").append('<a id="loading" style="margin: 10px;" target="_blank" title="IMDB" href="http://www.imdb.com/title/"><img style="border:0; margin-top: 3px; margin-bottom : 3px; width: 16px; height: 16px;"  src="'+imdb_img+'"></a>');
		});
		(function() {var css = "";
				css += ["@namespace url(http://www.w3.org/1999/xhtml);",
						"",
						"/* модификация вида */"
				].join("\n");
				if (false || (document.domain == "kinopoisk.ru" || document.domain.substring(document.domain.indexOf(".kinopoisk.ru") + 1) == "kinopoisk.ru")){
					css += [
						" div[class^=\"styles_root__\"],div[class^=\"styles_basicInfoSection\"],div[class^=\"styles_basicMediaSection\"] {padding: 0px 0 0px!important;}",
						" div[class*=\"styles_nameplate_\"] {right: 240px;!important;}",
						" "
					].join("\n");
					lkp=location.href;
					if (lkp.match('kinopoisk.ru/series/')){
						css += [
							"div[class*=\"styles_rootWithBranding_\"]{display: none!important;}",
							""
						].join("\n");
					}
				}
	//	}
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
		}());
	} catch (e) {
		unsafeWindow.console.log(e);
	}
}