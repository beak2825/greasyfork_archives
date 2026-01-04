// ==UserScript==
// @name            YouTube Audio Only
// @name:en         YouTube Audio Only
// @namespace       https://greasyfork.org/users/44041
// @include         http://*youtube.*/*watch*
// @include         https://*youtube.*/*watch*
// @include         https://*youtube.*/embed*
// @include         //*youtube.*/embed*
// @version         2
// @grant           none
// @description     Hide video and only play audio on YouTube
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @locale 
// @downloadURL https://update.greasyfork.org/scripts/31112/YouTube%20Audio%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/31112/YouTube%20Audio%20Only.meta.js
// ==/UserScript==

/*
$('h1').append('<input type="checkbox" id="toggle_block">');
$(':checkbox').click(function(){
  $('canvas').toggle();
});

$( document ).ready(function() {
  $('#watch7-sidebar-modules').find('img').each(function(){
    $(this).hide();
    console.error($(this));
  });
});
*/
$('video').ready(function() {
  
  
  
    $('#watch7-sidebar-modules').find('img').each(function(){
    $(this).hide();
    //console.error($(this));
  });
  
  //$(':checkbox').attr('checked', true);
  //$('video').css('display','none');

  var video = document.getElementsByTagName("video")[0];
  if(video) {
    video.addEventListener("playing", function() {
      
      
      $('h1').append('<input type="checkbox" id="toggle_block" checked>');
$(':checkbox').click(function(){
  $('canvas').toggle();
});

      
      //$('video').css('z-index','-9999');
      //$('video').css('width','0');
      wallPattern.init();
      $('#canvas').ready();
      //$('.html5-video-container').css('display','none');
      //console.error(video.duration);

      //console.error("playing");
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
     //console.log('loaded');
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
    //console.log('init');
    this.canvas = document.getElementById( 'canvas' );
    this.context = canvas.getContext( '2d' );
    this.canvas.width = 640;
    this.canvas.height = 360;
    this.preparePoints();
		this.createPattern();
		this.drawTitle();
    
  },
  
  drawTitle: function() {
    
    //var rawtitletext = $('#eow-title').text().trim();
    var titletext = $('#eow-title').text().trim();
    //var titletext = rawtitletext.replace(/(.{1,32})(?:\n|$| )/g, "$1\n");
    //var titletext = "The quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dog";
    var the_text = titletext.replace(" y ", " & ");
    the_text = the_text.replace(" Y ", " & ");
    the_text = the_text.replace(" )", ")");
    the_text = the_text.replace(" ]", "]");
    the_text = the_text.replace("( ", "(");
    the_text = the_text.replace("[ ", "[");
    the_text = the_text.replace(" - ", "\n");
    the_text = the_text.replace(/(.{1,35})(?:\n|$| )/g, "$1\n");
    
    drawString(this.context, the_text, (canvas.width / 2), (canvas.height / 2), '#ffffff',0,"Helvetica",30);
/*
    this.context.fillStyle = "white";
    this.context.font = "bold 30px Helvetica";
    //this.context.fillText(titletext, (canvas.width / 2) - 17, (canvas.height / 2) + 8);
    this.context.textAlign = 'center';
    this.context.fillText(titletext, (canvas.width / 2), (canvas.height / 2));
   */ 
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

function drawString(ctx, text, posX, posY, textColor, rotation, font, fontSize) {
	var lines = text.split("\n");
	if (!rotation) rotation = 0;
	if (!font) font = "'serif'";
	if (!fontSize) fontSize = 16;
	if (!textColor) textColor = '#000000';
	ctx.save();
  ctx.textAlign = 'center';
	ctx.font = "bold " + fontSize + "px " + font;
	ctx.fillStyle = textColor;
	ctx.translate(posX, posY);
	ctx.rotate(rotation * Math.PI / 180);
	for (i = 0; i < lines.length; i++) {
 		ctx.fillText(lines[i],0, i*fontSize);
	}
	ctx.restore();
}

//wallPattern.init();