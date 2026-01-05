// ==UserScript==
// @name        ViewMore
// @namespace		novhna
// @description	Enhance functionality for footboom.com forum
// @include     https://www.footboom.com/forum/*
// @include     http://www.footboom.com/forum/*
// @version     0.0.6
// @require     https://code.jquery.com/jquery-1.11.2.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/27680/ViewMore.user.js
// @updateURL https://update.greasyfork.org/scripts/27680/ViewMore.meta.js
// ==/UserScript==

$(document).ready(function () {
  setAppButton();

  initiateFunctions();
});

function initiateFunctions() {
  sheetsLess();
	setTimeout(function () {
    viewMore();
  }, 10);
  scaleWithRate();
}

function viewMore() {
	var imgExt= "[.jpg][.jpeg][.png][.gif]";
	var gifRef = [
		'https://image.flaticon.com/icons/svg/29/29579.svg',
		'https://image.freepik.com/free-icon/gif-file-format_318-45086.jpg'
	];
	var insecureRef = [
		'https://upload.wikimedia.org/wikipedia/en/archive/5/54/20051214002236!Unlock-icon.gif',
		'https://cdn0.iconfinder.com/data/icons/basic-ui-elements-round/700/09_lock_unlocked-512.png'
	];
	var aCollection= $('p a:not([class])');
	$.each(aCollection, function(i, a) {

		if ( a.id==="" && a.className==="" ) { // add image || video
			var link= a.href;
      var probExt= link.substr( link.lastIndexOf(".") ).toLowerCase();
			if (probExt.lastIndexOf(":")>-1) probExt= probExt.substr( 0, probExt.lastIndexOf(":") );
			if (probExt.lastIndexOf("/")>-1) probExt= probExt.substr( 0, probExt.lastIndexOf("/") );
			if (probExt.lastIndexOf("?")>-1) probExt= probExt.substr( 0, probExt.lastIndexOf("?") );

			if (imgExt.indexOf("["+probExt+"]") > -1) { // add image
				if (probExt === ".gif") {
          a.innerHTML = "<img src='" + gifRef[0] + "' style='height: 18px;' /> " + a.textContent;
				// } else if (link.indexOf('http://') > -1) {
        //   console.log('insecure image', link);
        //   a.innerHTML = "<img src='" + insecureRef[0] + "' style='height: 18px;' /> " + a.textContent;
        } else {
					a.innerHTML= "<div style='margin: 0 auto; text-align: center; '><img style='max-width:100%; '  src='"+link+"' ></div>";
					a.className= "shown-img"; // no-blink
					$("a.shown-img").hover(function () { $("a.shown-img").css("opacity", 1); }, function () { }); // no-blink
				}
			} else if ( link.indexOf('youtube')>-1 && link.indexOf('?v=')>-1 ) { // add video
				var v= link.substr( link.indexOf('?v=')+3 );
				if (v.indexOf('&')>-1) var v= v.substr( 0 , v.indexOf('&') ); // del after &
				$(a).replaceWith('<iframe width="560" height="315" src="https://www.youtube.com/embed/'+v+'" frameborder="0" allowfullscreen></iframe>');
			} else if ( link.indexOf('youtube')>-1 && link.indexOf('&v=')>-1 ) { // add video
				var v= link.substr( link.indexOf('&v=')+3 );
				if (v.indexOf('&')>-1) var v= v.substr( 0 , v.indexOf('&') ); // del after &
				$(a).replaceWith('<iframe width="560" height="315" src="https://www.youtube.com/embed/'+v+'" frameborder="0" allowfullscreen></iframe>');
			} else if ( link.indexOf('youtu.be')>-1 ) { // add video
				var v= link.substr( link.indexOf('.be/')+4 );
				var vTime= v.substr( v.indexOf('?t=')+3 );
				if (v.indexOf('?t=')>-1) var v= v.substr( 0, v.indexOf('?t=') );
				if (v.indexOf('&')>-1) var v= v.substr( 0 , v.indexOf('&') ); // del after &
				$(a).replaceWith('<iframe width="560" height="315" src="https://www.youtube.com/embed/'+v+'" frameborder="0" allowfullscreen></iframe>');
			} else {
				a.innerHTML = "<img src='https://www.google.com/s2/favicons?domain=" + a.origin + "' /> " + a.host;
				$(a).css({
					"color": "black",
					"border-radius": "10px",
					"border": "1px solid #DFDFDF",
					"padding": "4px 8px",
					"display": "inline-block",
					"font-family": "pf_din_text_comp_proregular,pt-regular,Arial,sans-serif",
					"background": "#F8C700"
				});
      }
		}

	});
}

function sheetsLess() {
	$('div.g-flow-hidden.b-text').each(function (i, post) {
    if ($(post).height() > window.innerHeight / 2) {
      sheetsLess.setFoldedStyle(post);
      $(post).click(sheetsLess.toggleSheet.bind(this));
    }
	});
}

sheetsLess.setFoldedStyle = function (element) {
  $(element).css({
    "max-height": window.innerHeight / 3 + "px",
    "box-shadow": "inset 0px -20px 20px -20px #111111",
    "cursor": "pointer"
  });
}

sheetsLess.setUnfoldedStyle = function (element) {
  $(element).css({
    "max-height": "none",
    "box-shadow": "none"
  });
}

sheetsLess.toggleSheet = function (e) {
  if ($(e.currentTarget).css("max-height") === 'none') {
    sheetsLess.setFoldedStyle(e.currentTarget);
  } else {
    sheetsLess.setUnfoldedStyle(e.currentTarget);
  }
}

const scaleWithRate = () => {
  $('div.m-comment-rate').each((i, item) => {
    const rate = +item.firstChild.textContent;
    if (rate) {
      const comment = item.parentNode.parentNode.parentNode.children[1];
      $(comment).css({ fontSize: Math.min(22, Math.max(8, 14 + +rate)) + 'px' });
    }
  });
}

// Not fully implemented
function setAppButton() {
  // $('body').append('<div id="plawka">↻</div>');
  // $('div#plawka').css({
  //   "display": "inline-block",
  //   "width": "50px",
  //   "height": "50px",
  //   "border-radius": "50%",
  //   "text-align": "center",
  //   "line-height": "50px",
  //
  //   "position": "fixed",
  //   "bottom": "10px",
  //   "right": "10px",
  //   "z-index": "1000",
  //
  //   "cursor": "pointer",
  //   "background-color": "#F8C700",
  //   "opacity": "0.5"
  // });
  // $('div#plawka').click(initiateFunctions);
}
