// ==UserScript==
// @name        Pone (Doge)
// @description Первоапрельское обновление VK 2014 года, переделанное под My Little Pony
// @include     http*://vk.com/*
// @include     http*://vk.com
// @version     2.4
// @grant       none
// @author
// @namespace http://complynx.net
// @downloadURL https://update.greasyfork.org/scripts/4418/Pone%20%28Doge%29.user.js
// @updateURL https://update.greasyfork.org/scripts/4418/Pone%20%28Doge%29.meta.js
// ==/UserScript==



var newHeight = 150;
var newWidth = 150;


//This all is for the case, file "doge.js" is removed from VK
var Doge = {
  
show: function() {
  
	//Generate random number, range 1-9
	var randomNumber = Math.floor((Math.random() * 9) + 1);
	
	//var src = 'http://img-fotki.yandex.ru/get/9801/110173670.0/0_a8950_afd76e46_orig';
	//var src = '/images/pics/doge'+(window.devicePixelRatio >= 2 ? '_2x' : '')+'.png';
	
	//Show pone only if random number is equal to 1
	if (randomNumber == 1) {
	
		if (Doge.shown) {
          
			return false;
		}
		
		Doge.shown = true;
		
		dogeDom = ge('vk_doge');
		
		if (!dogeDom) {
          
			var src;
			var randomPony = Math.floor((Math.random() * 5) + 1);
			
			//Pinkie Pie
			if (randomPony == 1) {
				src = "http://img-fotki.yandex.ru/get/6820/110173670.0/0_b4a7b_9ce89295_orig";
				newHeight = 150;
				newWidth = 150;
			}
			//Derpy
			else if (randomPony == 2) {
				src = "http://img-fotki.yandex.ru/get/9801/110173670.0/0_a8950_afd76e46_orig";
				newHeight = 150;
				newWidth = 150;
			}
			//Twilight Sparkle
			else if (randomPony == 3) {
				src = "http://img-fotki.yandex.ru/get/6812/110173670.0/0_b4eea_e1387f90_orig";
				newHeight = 150;
				newWidth = 150;
			}
			//Applejack
			else if (randomPony == 4) {
				src = "https://img-fotki.yandex.ru/get/6735/110173670.1/0_cd171_354fb32d_orig";
				newHeight = 187;
				newWidth = 150;
			}
			//Princess Celestia
			else {
				src = "https://img-fotki.yandex.ru/get/15582/110173670.0/0_bdcab_6e9d136c_orig";
				newHeight = 200;
				newWidth = 278;
			}
			
			var dogeDom = ce('a', {
				id: 'vk_doge',
				innerHTML: '<div style="font-family: \'Comic Sans MS\', cursive; font-size: 24px; position: absolute; margin-top: -56px; width: 150px; text-align: center; opacity: 0;filter: alpha(opacity=0);">MAGIC</div><img src="'+src+'" width="' + newWidth + '" height=' + newHeight + '">',
			}, {
				position: 'fixed',
				bottom: -newHeight,
				right: 4,
				width: newWidth,
				height: newHeight,
				padding: '35px 35px 0px 35px',
				zIndex: 110
			});
			
			utilsNode.appendChild(dogeDom);
			debugLog('add event here',	Doge.over);
			addEvent(dogeDom, 'mouseover', Doge.over);
		}
		
		debugLog(dogeDom);
		show(dogeDom);
		animate(dogeDom, {bottom: -56}, {duration: 200})
		setTimeout(Doge.hide, 8000);
	}
},

	
over: function() {
	
    if (Doge.wasOver) {
    
    	return false;
  	}
	
  	Doge.wasOver = true;
  	var dogeDom = ge('vk_doge');
  	var dogeTxt = dogeDom.firstChild;
  	
  	animate(dogeDom, {bottom: 0}, 200, function() {
      
      	setTimeout(function() {
        	animate(dogeDom, {bottom: -newHeight}, 200, function() {
          		
            	Doge.updateLikes();
          		setTimeout(function() {
              
            		fadeOut(dogeTxt, 800, function() {
                      	hide(dogeDom);
                     	Doge.wasOver = false;
                      	Doge.shown = false;
                  	});
              	}, 500)

        	});
        	
          	animate(dogeTxt, {opacity: 1, color: '#C35AC3', marginTop: -90}, 200);
    	}, 300)
	
  	});
	
 	animate(dogeTxt, {opacity: 1}, 300);	
	setTimeout(function(){utilsNode.removeChild(dogeDom);}, 2000)
},

  
hide: function() {
  var dogeDom = ge('vk_doge');
  animate(dogeDom, {bottom: -newHeight}, 200, function() {
    hide(dogeDom);
	Doge.wasOver = false;
    Doge.shown = false;
  });
},

  
updateLikes: function() {
  
  var likes = geByClass('post_like_link');
  for (var i in likes) {
    likes[i].innerHTML = 'My Little Like';
  }
  var onlines = geByClass('online');
  for(var i in onlines) {
    if (onlines[i].tagName == 'SPAN') {
      onlines[i].innerHTML = 'So Online';
    }
  }
},

  
initSound: function(url) {
  if (!window.Sound) {
    cur.sound = {play: function () {}, stop: function() {}};
  } else {
    cur.sound = new Sound(url, {forceMp3: true, forcePath: url});
  }
},

  
blowTimer: function(el) {
  
  if (cur.blowing) {
      return false;
  }
  if (cur.blowed) {
      return nav.go(el);
  }
  Doge.initSound('mp3/boom.mp3');
  cur.blowing = true;
  var st = 'style="font-size: 2em; text-align: center; font-weight: bold;"';
  showDoneBox('<div ' + st + '>3</div>', {w: 20, out: 3000});
  var start = new Date().getTime(), el = geByClass1('top_result_baloon');
  var interval = setInterval(function() {
    var now = 3000 - (new Date().getTime() - start);
    if (now <= 0) {
      clearInterval(interval);
      Doge.blowImages();
    } else {
      el.innerHTML = '<div ' + st + '>' + Math.ceil(now / 1000) + '</div>';
    }
  }, 100);
},

  
blowImages: function() {
  var imgs = geByTag('img', bodyNode);
  cur.sound.play();
  each(imgs, function(i, img) {
    if (img.parentNode === bodyNode || !isVisible(img)) return;
    var sz = getSize(img), pos = getXY(img),
        centerPos = [lastWindowWidth / 2, scrollGetY() + lastWindowHeight / 2], centerSz = [0, 0], bg, step = 1500;
    if (!sz[0] || !sz[1]) return;
    bg = ce('div', {}, {width: sz[0], height: sz[1], backgroundColor: '#f1f1f1', display: 'inline-block', border: '0px', margin: '0px', padding: '0px'});
    img.parentNode.insertBefore(bg, img);
    bodyNode.insertBefore(img, domFC(bodyNode));
    setStyle(img, {position: 'absolute', left: pos[0], top: pos[1], width: sz[0], height: sz[1], zIndex: 100});
    var dx = pos[0] - centerPos[0] + (sz[0] - centerSz[0]) / 2,
        dy = pos[1] - centerPos[1] + (sz[1] - centerSz[1]) / 2;
    animate(img, {left: pos[0] + step * dx / Math.abs(dx), top: step * dy / Math.abs(dx)}, {duration: 1000, transition: Fx.Transitions.linear, onComplete: function() {
      re(img);
      cur.blowing = false;
      cur.blowed = true;
    }})
  });
},

eof:1
};


try {
  
	stManager.done('doge.js');
}
catch(e)
{
  
}
//*/

window.Doge = Doge;

if (stManager) {
  
	stManager.add('page.js', function() {

      var oldlike = wall.likeIt;  
      wall.likeIt = function() {
          Doge.show();
          return oldlike.apply(this, arguments);
      };

	});
}
