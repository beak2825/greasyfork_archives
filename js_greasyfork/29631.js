// ==UserScript==
// @name            YouTube Video Only
// @name:en         YouTube Video Only
// @namespace       https://greasyfork.org/users/44041
// @include         http://*youtube.*/*watch*
// @include         https://*youtube.*/*watch*
// @version         1
// @grant           none
// @description     Hide video and only play audio on YouTube
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @locale 
// @downloadURL https://update.greasyfork.org/scripts/29631/YouTube%20Video%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/29631/YouTube%20Video%20Only.meta.js
// ==/UserScript==

$('video').ready(function() {
  //$('video').css('display','none');
console.log('video ready');

  var video = document.getElementsByTagName("video")[0];
  if(video) {
    video.addEventListener("playing", function() {
      //$('video').css('z-index','-9999');
      //$('video').css('width','0');
      wallPattern.init();
      $('#canvas').ready();
      //$('.html5-video-container').css('display','none');
      console.error("playing");
    })
  } else {
    console.error("Video element not found");
  }
  
});

jQuery(function($){
    //$('video').css('width','0');
    var _highest = 0;   

    $("div").each(function() {
        var _current = parseInt($(this).css("zIndex"), 10);
        if(_current > _highest) {
            _highest = _current + 1;
        }
    });
    //$('.html5-video-container').append('<div style="position:absolute;z-index:'+_highest+';background:#ecebeb;border:1px solid #333;border-radius:5px;height:360px;width:640px;background-image: url("http://i.imgur.com/iZHYO4N.jpg");"> </div>');
    $('.html5-video-container').append('<canvas id="canvas" onload="wallPattern.init();" style="position:absolute;z-index:'+_highest+';border-radius:5px;height:360px;width:640px;"> </div>');

   $('#canvas').ready(function() {
     console.log('loaded');
     wallPattern.init();
     });
  
});

var wallPattern = {
  
  // Settings
  spacingX: 55,
  spacingY: 35,
  offsetVariance: 13,
  baseRadius: 55,
  
  // Other Globals
  points: [],
  canvas: null,
  context: null,
  
  init: function() {
    console.log('init');
    this.canvas = document.getElementById( 'canvas' );
    this.context = canvas.getContext( '2d' );
    this.canvas.width = 640;
    this.canvas.height = 360;
    this.preparePoints();
		this.createPattern();
		this.drawTitle();
    
  },
  
  drawTitle: function() {
    
    var rawtitletext = $('#eow-title').text().trim();
    var titletext = $('#eow-title').text().trim();
    //var titletext = rawtitletext.replace(/(.{1,32})(?:\n|$| )/g, "$1\n");
    //var titletext = "The quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dog";

    
    this.context.fillStyle = "white";
    this.context.font = "bold 30px Helvetica";
    //this.context.fillText(titletext, (canvas.width / 2) - 17, (canvas.height / 2) + 8);
    this.context.textAlign = 'center';
    this.context.fillText(titletext, (canvas.width / 2), (canvas.height / 2));
    
  },
  
  preparePoints: function() {
    
    var width, height, i, j, k, offsetX, offsetY;
    var maxVariance = this.offsetVariance * 2;
    
    // Vertical spacing
    for ( i = this.spacingY; i < this.canvas.height; i += this.spacingY ) {
      
      var pointSet = [];
      
      // Horizontal spacing
      for(j = this.spacingX; j < this.canvas.width; j += this.spacingX ) {
        
        offsetX = Math.round((Math.random() * maxVariance) - this.offsetVariance);
        offsetY = Math.round((Math.random() * maxVariance) - this.offsetVariance);
        var offsetR = Math.round((Math.random() * maxVariance) - this.offsetVariance);
        
				pointSet.push( {x: j + offsetX, y: i + offsetY, radius: this.baseRadius + offsetR} )
      }
      
      this.points.push( this.shuffleArray( pointSet ) );
    } 
  },

  createPattern: function() {
    this.context.beginPath();
    this.context.rect(0, 0, 640, 360);
    this.context.fillStyle = "black";
    this.context.fill();
    
		var i, j, k, currentPoints, currentPoint;
    
    for ( i = 0; i < this.points.length; i++ ) {
      
      currentPoints = this.points[i]; 
      
      for ( j = 0; j < currentPoints.length;  j++ ) {
        	
       	currentPoint = currentPoints[j];
        for ( k = currentPoint.radius; k > 0; k-=10 ) {
        	
        	
     		  this.context.beginPath();
          this.context.arc(currentPoint.x, currentPoint.y, k ,0 , Math.PI*2, true);
          this.context.closePath();
          this.context.fillStyle='#000';
          this.context.strokeStyle='purple';
          this.context.fill();
          this.context.stroke();   
        }
      }
    }
  },
 
  // Shuffle algorithm from: http://stackoverflow.com/questions/962802/is-it-correct-to-use-javascript-array-sort-method-for-shuffling
  shuffleArray: function( array ) {
    
    var tmp, current, top = array.length;

    if(top) while(--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
    }

    return array;
  }
}

//wallPattern.init();