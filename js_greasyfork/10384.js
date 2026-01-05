// ==UserScript==
// @name        Spardot Ban Bot
// @namespace   http://boards.420chan.org/*
// @description Banomatic 76
// @include     http://boards.420chan.org/*
// @version     2
// @grant	none
// @downloadURL https://update.greasyfork.org/scripts/10384/Spardot%20Ban%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/10384/Spardot%20Ban%20Bot.meta.js
// ==/UserScript==

str = "";
function ban( element, mod, duration, reason ) {
	var banDiv = document.createElement('div');
	banDiv.className = 'ban';

	banDiv.innerHTML = '<div class="banimage"><img src="/static/images/block.png" alt="Banned" /> </div> <div class="banmessages">   <div class="banmsg"> User was banned for this post </div>  <div class="bannedby"> User was banned by: <span style="color: black">' + mod + '</span> for <span style="color: black">' + duration + '</span>  </div> <div class="banreason"> Reason: <span style="color: black">' + reason + '</span> </div> </div>					 </div>  				  ';
	element.appendChild( banDiv );
}

trackNo = null;

// Stolen from stackoverflow

var getCumulativeOffset = function (obj) {
	var rect = obj.getBoundingClientRect();
	var bodyRect = document.body.getBoundingClientRect();
	var result = {
		y1: rect.top - bodyRect.top,
		y2: rect.bottom - bodyRect.bottom,
		x1: rect.left - bodyRect.left,
		x2: rect.right - bodyRect.right,
		w: rect.right - rect.left,
		h: rect.bottom - rect.top
	};

	/*
	console.log('Bounding Client Rect: ' + result['x1'] + ', ' + result['y1'] + ', ' + result['x2'] + ', ' + result['y2'] );
	console.log('Left: ' + rect.left + ', ' + bodyRect.left);

	console.log('Top: ' + rect.top + ', ' + bodyRect.top + ' -> ' + ( rect.top - bodyRect.top) );
	console.log( document.documentElement.scrollTop );
	console.log( obj.offsetTop );
	*/

	return result;


}
	/*
var getCumulativeOffset = function (obj) {
    var left, top, width, height;
    left = top = width = height = 0;
    width = obj.offsetWidth;
    height = obj.offsetHeight;
    if (obj.offsetParent) {
        do {
            left += obj.offsetLeft;
            top  += obj.offsetTop;
	    //alert( obj.offsetTop );
        } while (obj = obj.offsetParent);
    }
    return {
        x1 : left,
        y1 : top,
	w : width,
	h : height,
	x2 : left + width,
	y2 : top + height
    };
};
*/

function SparSpright( x, y, velocity, No ) {
	this.imgRoot = 'http://i.imgur.com/';
	this.frames = Array(
			Array(
				'VxQcIHn.gif',
				'N35tBBL.gif'
			     ),
			Array(
				'LuCydSu.gif',
				'01ofVDQ.gif'
			     ),
			Array(
				'jubOvNg.gif'
			     ),
			Array(
				'NdPT08O.gif'
			     )
			);
	this.element = document.createElement('div');

	this.element.style.position = 'absolute';
	this.element.innerHTML = '<img src="' + this.imgRoot + '/' + this.frames[0][0] + '" />';
	this.element.addEventListener( 'click', this.track, false );
	this.velocity = velocity;
	this.step = 0;
	this.No = No;
	this.messages = Array(
			'FUCK YOU, YOU FUCKING FUCK!!!',
			'GET FUCKED!!!',
			'SORRY, THIS IS NOW A NO RETARD ZONE, GO FUCK YOURSELF!!!',
			'DON\'T YOU HAVE SOME OFFS TO FUCK?',
			'YOU ARE A STUPID, USELESS PIECE OF SHIT, ENJOY YOUR BAN.',
			'DO THE WORLD A FAVOR AND GO BURN TO DEATH.',
			'THERE ARE PIECES OF SHIT AND THEN THERE ARE PIECES OF SHIT AND THEN THERE\'S YOU.',
			'I WOULD SAY THAT YOU ARE DOG SHIT IF YOU WERENN\'T SO USELESS.',
			'SHOULDN\'T YOU BE OFF EATING YOUR OWN SHIT RIGHT NOW?',
			'MORE INTELLIGENT STUFF THAN YOU COMES OUT OF MY ASS WHEN I\'M TAKING A SHIT.',
			'WE NEED YOU AROUND HERE LIKE WE NEED A RETARDED RAPIST WITH SYPHILIS.',
			'YOU ARE THE HUMAN EQUIVELANT OF VENEREAL DISEASE.',
			'YOU WERE BORN WHEN YOUR MOTHER CONFUSED HER VAGINA AND HER ASSHOLE.',
			'I WOULD TELL YOU TO GO GET HIT BY A TRUCK, BUT I WOULD FEEL BAD FOR THE TRUCK.'
		);
	this.minuteMin = 10000000;
	this.minuteRange = 10000000000;
	this.targetPosition = Array();
	this.targetFinal = Array();
	this.state = 0;

	var body = document.getElementsByTagName('body')[0];
	body.appendChild( this.element );

	// Move spardot
	this.setPosition = function( x, y ) {
		// Move
		this.position = Array( x, y );
		this.element.style.top = y + 'px';
		this.element.style.left = x + 'px';
	}
	// Calc step vector, run this every step, it can change if a ban is entered higher up the page
	this.updateVect = function() {
		// Calc y position of target
		coff = getCumulativeOffset( this.target );
		//this.targetPosition[1] = Math.round( coff['y1'] + coff['y2'] * 0.5 )/2;

		// Calculate a step displacement vector
		this.vect = Array( this.targetPosition[0] - this.position[0], this.targetPosition[1] - this.position[1] );
		vectCo = Math.sqrt( this.vect[0] * this.vect[0] + this.vect[1] * this.vect[1] );
		this.vect[0] = this.velocity * this.vect[0] / vectCo;
		this.vect[1] = this.velocity * this.vect[1] / vectCo;
	}

	this.scrollTo = function () {
		window.scrollTo( this.position[0], this.position[1] - 100);
	}

	// Select a new target and compute vector
	this.retarget = function() {
		// Select a random target element
		var blockQuotes = document.getElementsByTagName('blockquote');
		this.target = blockQuotes[ Math.round( Math.random() * ( blockQuotes.length - 1 ) ) ];
		//this.target = blockQuotes[ blockQuotes.length - 1 ];
		this.state = 0;
		//this.target.style.background = 'blue';

		// Pick a nice x position in the element to move to
		coff = getCumulativeOffset( this.target );

		// Initial x target position is somewhere out in the page
		var xtarget = Math.random() * Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
		this.targetPosition[0] = Math.round( coff['x1'] + Math.random() * xtarget ); 
		// Initial y target is halfway from current y position to new y position
		this.targetPosition[1] = this.position[1] + Math.round( ( coff['y1'] - this.position[1]) / 2 );

		this.setFinalTarget()

		//this.pointer( this.targetFinal[0], this.targetFinal[1], 20, 20, '' );
		//console.log( coff['x1'] + ', ' + coff['y1'] + ', Target content: ' + this.target.innerHTML );
		//console.log('Target final position: ' + coff['x1'] + ', ' + coff['y1'] );
	}
	this.setFinalTarget = function() {
		coff = getCumulativeOffset( this.target );

		this.targetFinal[0] = coff['x1'];
		this.targetFinal[1] = coff['y1'];
	}

	// For debugging
	this.pointer = function( x, y, w, h, info )
	{
		var pointer = document.createElement('div');
		pointer.style.position = 'absolute';
		pointer.style.background = 'green';

		pointer.style.left = x + 'px';
		pointer.style.top = y + 'px';

		pointer.innerHTML = '<img src="' + this.imgRoot + '/' + this.frames[0][0] + '" /><p>' + x + ', ' + y + ', ' + info + '</p>';

		var body = document.getElementsByTagName('body')[0];
		body.appendChild( pointer );
	}

	// Move the sparspright to her next location and, if it's time, ban and select the next target
	this.increment = function( incNo ) {
		if( this.state == 2 ) {
			this.actionDelayCount += 1;
			if( this.actionDelayCount > actionDelay ) {
				this.retarget();
			} else {
				return;
			}
		}
		// Move a step
		var x = this.position[0] + this.vect[0];
		var y = this.position[1] + this.vect[1];

		/*
		var xOff = this.targetPosition[0] - this.position[0];
		var yOff = this.targetPosition[1] - this.position[1];

		var dist0 = Math.sqrt( xOff * xOff + yOff * yOff ); 
		*/

		if( this.state == 1 ) {
			this.setFinalTarget();
			this.targetPosition[0] = this.targetFinal[0];
			this.targetPosition[1] = this.targetFinal[1];
			//console.log('Setting target to final target: ' + this.targetPosition[0] + ', ' + this.targetPosition[1] );
		}

		this.updateVect();
		this.setPosition( x, y );
		//console.log('Current position: ' + x + ', ' + y + '; target: ' + this.target.value + ', ' + this.targetPosition[0] + ', ' + this.targetPosition[1] + '; final target: ' + this.targetFinal[0] + ', ' + this.targetFinal[1] );

		// See how far away we are from target
		var xOff = this.targetPosition[0] - this.position[0];
		var yOff = this.targetPosition[1] - this.position[1];
		var dist = Math.sqrt( xOff * xOff + yOff * yOff ); 

		var dir = null;
		if( this.vect[0] > 0 ) {
			dir = 1;
		} else {
			dir = 0;
		}

		// Ban and retarget if in range
		if( dist <= this.velocity ) {
			if( this.state == 0 ) {
				this.state = 1;
			} else if( this.state == 1 ) {
				dir += 2;
				stepFrame = this.step % this.frames[dir].length;
				this.element.innerHTML = '<img src="' + this.imgRoot + '/' + this.frames[dir][stepFrame] + '" />';
				ban( this.target, 'spardot', this.minuteMin + Math.round( this.minuteRange * Math.random() ) + ' minutes', this.messages[ Math.round( ( this.messages.length - 1 ) * Math.random() ) ] );
				this.state = 2;
				this.actionDelayCount = 0;
			}
		} else {
			stepFrame = this.step % this.frames[dir].length;
			this.element.innerHTML = '<img src="' + this.imgRoot + '/' + this.frames[dir][stepFrame] + '" />';
			this.step++;
		}
	}

	this.setPosition( x, y );
	this.retarget();
	this.updateVect()
}

// Sparspright base velocity in pixels per step
velocity = 20;
// Number of sparsprights
sparSprightN = 5;
// Delay between steps
delay = 100;
// The number of increments that sparbot waits when banning
actionDelay = 10;
// Set to track a sparspright
trackNo = null;

sparSprights = Array();
for( i=0; i < sparSprightN; i++ ) {
	sparSprights.push( new SparSpright( -100, -100, velocity * ( 1 + Math.random() * 1), i ) );
}

if( sparSprightN > 0 ) {
	setInterval( function() {

			for( i=0; i < sparSprights.length; i++ ) {
				sparSprights[i].increment(i);
				if( trackNo != null ) {
					//alert( trackNo + ', ' + i );
				}
				if( trackNo == i ) {
					sparSprights[i].scrollTo();
				}
			} } ,
			delay
	);
}
