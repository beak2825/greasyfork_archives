// ==UserScript==
// @name Scroll Top Button
// @description Fast and lightweight scrolltop button
// @author NeoCortex
// @license MIT
// @version 0.1.2
// @include *://*
// @namespace https://greasyfork.org/users/12790
// @downloadURL https://update.greasyfork.org/scripts/36507/Scroll%20Top%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/36507/Scroll%20Top%20Button.meta.js
// ==/UserScript==
(function (window, undefined) {
      var w = window;

      if (w.self != w.top) {
         return;
      }
    
	  var buttonMargins = '15px';
	  var buttonEdges = '4px';
	  var buttonSize = '40px';
	  var buttonOpacity = '0.3';
	  var buttonHoverOpacity = '0.7';
	  var fontSize = '35px';
	  var buttonColor = 'black';
	  var transitionDelay = '.3s';
	  var transitionType = 'ease-in-out';

	  var container = document.createElement('div');
	  var sbody = container.createShadowRoot();
	  var btnClass = Math.random().toString(36).replace(/[^a-z]+/g, '');
	  var styles = '.' + btnClass + '{';
	  styles += 'position: fixed;';
	  styles += 'cursor: pointer;';
	  styles += 'bottom: ' + buttonMargins + ';';
	  styles += 'right: ' + buttonMargins + ';';
	  styles += 'border-radius: ' + buttonEdges + ';';
	  styles += 'width: ' + buttonSize + ';';
	  styles += 'height: ' + buttonSize + ';';
	  styles += 'opacity: ' + buttonOpacity + ';';
	  styles +='z-index: 99;';
	  styles += 'transition: all ' + transitionDelay + ' ' + transitionType + ';';
	  styles += 'background: ' + buttonColor + ';}';
	  styles += '.' + btnClass + ':hover{';
	  styles += 'opacity: ' + buttonHoverOpacity + ';';
      styles += 'transform:scale(1.1);}';
	  styles += '.' + btnClass + '>span{';
	  styles += 'color: white;opacity: 1;font-size:' + fontSize + ';';
	  styles += 'width:100%;height:100%;margin:0 auto;display:block;';
	  styles += 'line-height:' + buttonSize + ';text-align:center;}';
	  styles += '.' + btnClass + '.' + btnClass + '_hidden{';
	  styles += 'opacity: 0;transition: all ' + transitionDelay +' ' + transitionType + '}';
	  var btn = document.createElement('div');
	  var style = document.createElement('style');
	  style.innerHTML = styles;
	  sbody.appendChild(style);
	  btn.className = btnClass + (w.scrollY === 0 ? ' ' + btnClass + '_hidden' : '');
	  btn.innerHTML = '<span>&#129145;</span>';
	  btn.addEventListener('click', function scrollToTop() {
	  var scrollDuration = 700;
	  const   scrollHeight = w.scrollY,
			  scrollStep = Math.PI / ( scrollDuration / 15 ),
			  cosParameter = scrollHeight / 2;
	  var     scrollCount = 0,
			  scrollMargin,
			  scrollInterval = setInterval( function() {
				  if ( w.scrollY !== 0 ) {
					  scrollCount = scrollCount + 1;
					  scrollMargin = cosParameter - cosParameter * Math.cos( scrollCount * scrollStep );
					  w.scrollTo( 0, ( scrollHeight - scrollMargin ) );
				  }
				  else clearInterval(scrollInterval);
			  }, 15 );
	  }, false);
	  document.addEventListener('scroll', function (event) {
		  var btn = sbody.querySelector('.' + btnClass);
		  if(w.scrollY === 0) {
			btn.className = btnClass + ' ' + btnClass + '_hidden';
			setTimeout(function(){
			  btn.style.right = '-9999px';
			}, 300);
		  } else {
			btn.style.right = buttonMargins;
			btn.className = btnClass;
		  }
	  });
	sbody.appendChild(btn);
    w.onload = function() {
        document.body.appendChild(container);
    };
})(window);