// ==UserScript==
// @name         DigDig.io AutoOreX
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  AutoOreX Collects Diamond, Gold, Urananium & Amethyst!
// @author       Stronurus
// @match        *://digdig.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462361/DigDigio%20AutoOreX.user.js
// @updateURL https://update.greasyfork.org/scripts/462361/DigDigio%20AutoOreX.meta.js
// ==/UserScript==

(function() {
    'use strict';

let timeRan = 0;

let lastTime = 0;

const chunkSize = 64;
const resourcePositions = [];

let isDead = false;
let isRunning = false;

let health = 0;

let border = null;

const chunks = [];

let serverIndex = 0;
const servers = [];

const modes = [ 'ffa'];

let angle = Math.random() * Math.PI * 2;

function changeAngle() {
  angle = Math.random() * 2 * Math.PI - Math.PI;

  const interval = Math.random() * 19000 + 1000; // random interval between 1 and 20 seconds

  setTimeout(changeAngle, interval);
}

changeAngle();

init();

async function init() {

  for ( let i = 0; i < modes.length; i ++ ) {

    const response = await fetch( 'https://api.n.m28.io/endpoint/digdig-' + modes[ i ] + '/findEach' );

    const json = await response.json();

    for ( let key in json.servers ) {

      servers.push( json.servers[ key ].id );

    }

  }

  isRunning = true;

  window.addEventListener( 'keyup', function ( event ) {

    if ( String.fromCharCode( event.keyCode ) === 'B' ) {

      isRunning = ! isRunning;

      setTimeout( function () {

        setAttack( isRunning );

      }, 0 );

    }

  } );

}

window.requestAnimationFrame = new Proxy( window.requestAnimationFrame, {
  apply( target, thisArgs, args ) {

    if ( isRunning === true ) {

      args[ 0 ] = new Proxy( args[ 0 ], {
        apply( target, thisArgs, args ) {

          isDead = false;

          healthX.length = 0;
          health = 0;

          border = null;

          resourcePositions.length = 0;

          Reflect.apply( ...arguments );

          const now = Date.now();

          if ( isRunning && lastTime > 0 ) {

            timeRan += now - lastTime;

          }

          lastTime = now;

          if ( isDead === true || health <= 0 ) {

            pressEnter();

            return;

          }

          if ( resourcePositions.length > 0 ) {

  let target = null;

  if ( border !== null ) {

    const [ bx, by, br ] = border;

    for ( let i = 0; i < resourcePositions.length; i ++ ) {

      const [ x, y ] = resourcePositions[ i ];

      if ( Math.hypot( x - bx, y - by ) < br ) {

        target = resourcePositions[ i ];
        break;

      }

    }

  } else {

    target = resourcePositions[ 0 ];

  }

  if (target !== null) {

    mouseMove(target[0], target[1]);

    for ( let i = 0; i < resourcePositions.length; i ++ ) {

      const [ x, y ] = resourcePositions[ i ];

      if (x === target[0] && y === target[1]) {

        resourcePositions.splice(i, 1);
        break;

      }

    }

    return;

  }

}

          mouseMove(
            ( Math.cos( angle ) * 0.5 + 0.5 ) * window.innerWidth,
            ( Math.sin( angle ) * 0.5 + 0.5 ) * window.innerHeight
          );

          if ( health <= 0.00 ) {

            angle = Math.random() * Math.PI * 2;

            serverIndex = ( serverIndex + 1 ) % servers.length;

            cp6.forceServerID( servers[ serverIndex ] );

            while ( chunks.length > 0 ) {

              chunks.shift().resources.length = 0;

            }

          }

        }
      });

    }

    return Reflect.apply( ...arguments );

  }
} );

const Context = CanvasRenderingContext2D.prototype;

Context.arc = new Proxy( Context.arc, {
  apply( target, ctx, [ x, y, r ] ) {

    Reflect.apply( ...arguments );

    if ( isRunning && ctx.fillStyle === '#222222' && x !== 0 && y !== 0 ) {

      border = [ x, y, r ];

      ctx.save();

      ctx.translate( window.innerWidth / 2, 10 );

      ctx.font = 'bolder 30px Ubuntu';

      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      const a = ' AutoOreX V:0.3 Mining...';

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000';

      ctx.strokeText( a, 0, 0 );

      ctx.fillStyle = '#FFD700';
      ctx.fillText( a, 0, 0 );

      const seconds = timeRan / 1000;
      const mins = Math.floor( seconds / 60 );

      const b ='Running for ' + ( mins > 0 ? mins + 'm ' : '' ) + ( seconds % 60 ).toFixed( 1 ) + 's';

      ctx.font = 'bolder 18px Ubuntu';

      ctx.strokeText( b, 0, 32 );
      ctx.fillText( b, 0, 32 );

      ctx.restore();

    }

  }
} );

Context.drawImage = new Proxy( Context.drawImage, {
  apply( target, thisArgs, [ { resources } ] ) {

    if ( resources !== undefined ) {

      const { a, d, e, f } = thisArgs.getTransform();

      for ( let i = 0; i < resources.length; i ++ ) {

        const [ m, n, ] = resources[ i ];

        resourcePositions.push( [
          m / chunkSize * a + e,
          n / chunkSize * d + f
        ] );
      }

       setTimeout(() => {
        resourcePositions.length = 0;
      }, 5000);
    }

    return Reflect.apply( ...arguments );

  }
} );

const healthX = [];

const params = {
  apply( target, thisArgs, [ x ] ) {

    healthX[ target.name === 'moveTo' ? 0 : 1 ] = x;

    return Reflect.apply( ...arguments );

  }
};

Context.moveTo = new Proxy( Context.moveTo, params );
Context.lineTo = new Proxy( Context.lineTo, params );

Context.stroke = new Proxy( Context.stroke, {
  apply( target, thisArgs, args ) {

    if ( thisArgs.strokeStyle === '#75dd34' ) {

      health = ( healthX[ 0 ] - healthX[ 1 ] ) / ( 2 * healthX[ 0 ] );

    }

    return Reflect.apply( ...arguments );

  }
} );

const OffscreenContext = typeof OffscreenCanvasRenderingContext2D !== 'undefined' ?
  OffscreenCanvasRenderingContext2D.prototype : Context;

OffscreenContext.drawImage = new Proxy( OffscreenContext.drawImage, {
  apply( target, thisArgs, [ { resources } ] ) {

    if ( resources !== undefined ) {

      console.log( 'here!' );

      thisArgs.canvas.resources = resources;

      if (resources.length > 0) {
        setTimeout(() => {
          resourcePositions.length = 0;
        }, 5000); // wait 5 seconds before clearing resourcePositions
      }

    }

    return Reflect.apply( ...arguments );

  }
} );

OffscreenContext.fillRect = new Proxy( OffscreenContext.fillRect, {
  apply( target, thisArgs, args ) {

    if ( thisArgs.fillStyle === '#000000' ) {

      isDead = true;

    }

    return Reflect.apply( ...arguments );

  }
} );

OffscreenContext.putImageData = new Proxy( OffscreenContext.putImageData, {
  apply( target, thisArgs, [ { data } ] ) {

    console.log( thisArgs.canvas );

    if ( thisArgs.canvas.width === chunkSize && thisArgs.canvas.height === chunkSize ) {

      thisArgs.canvas.resources = [];

      for ( let i = 0; i < data.length; i += 4 ) {

        if ( isResourceColor( data[ i ], data[ i + 1 ], data[ i + 2 ] ) ) {

          const index = i / 4;

          thisArgs.canvas.resources.push( [
            index % chunkSize,
            Math.floor( index / chunkSize )
          ] );

        }

      }

      chunks.push( thisArgs.canvas );

    }

    return Reflect.apply( ...arguments );

  }
} );

OffscreenContext.fillRect = new Proxy( OffscreenContext.fillRect, {
  apply( target, thisArgs, [ x, y, width, height ] ) {

    if ( thisArgs.canvas.width === chunkSize && thisArgs.canvas.height === chunkSize ) {

      if ( thisArgs.canvas.resources === undefined ) {

        thisArgs.canvas.resources = [];

      }

      if ( isResourceColor( thisArgs.fillStyle ) ) {

        thisArgs.canvas.resources.push( [ x, y ] );

      }

    }

    return Reflect.apply( ...arguments );

  }
} );

OffscreenContext.clearRect = new Proxy( OffscreenContext.clearRect, {
  apply( target, thisArgs, [ x, y, width, height ] ) {

    if ( thisArgs.canvas.resources !== undefined ) {

      if ( width === chunkSize && height === chunkSize ) {

        thisArgs.canvas.resources.length = 0;

      } else {

        for ( let i = 0; i < thisArgs.canvas.resources.length; i ++ ) {

          const [ m, n ] = thisArgs.canvas.resources[ i ];

          if ( m === x && n === y ) {

            thisArgs.canvas.resources.splice( i, 1 );
            break;

          }

        }

      }

    }

    return Reflect.apply( ...arguments );

  }
} );

function isResourceColor
( r, g, b ) {

  if ( arguments.length === 1 ) {

    g = parseInt( r.substring( 3, 5 ), 16 );
    b = parseInt( r.substring( 5, 7 ), 16 );
    r = parseInt( r.substring( 1, 3 ), 16 );

  }

  return (
    Math.hypot( 0xa5 - r, 0x9e - g, 0x15 - b ) < 25 ||
    Math.hypot( 0x3c - r, 0xc4 - g, 0x3d - b ) < 25 ||
    Math.hypot( 0x6d - r, 0xd6 - g, 0xff - b ) < 25 ||
    Math.hypot( 0x31 - r, 0xa5 - g, 0x9b - b ) < 25 ||
    Math.hypot( 0x35 - r, 0xa8 - g, 0x31 - b ) < 25 ||
    Math.hypot( 0xaf - r, 0x31 - g, 0xb2 - b ) < 25
  );
}

function pressEnter() {

  keyEvent( 'keydown', 13 );
  keyEvent( 'keyup', 13 );

}

function setAttack( bool ) {

  keyEvent( bool !== false ? 'keydown' : 'keyup', 32 );

}

function setHeal( bool ) {

  keyEvent( bool !== false ? 'keydown' : 'keyup', 16 );

}

function keyEvent( type, keyCode ) {

  window.dispatchEvent( new KeyboardEvent( type, { keyCode } ) );

}

function mouseMove( clientX, clientY ) {

  const randomness = 25; // adjust the randomness to your liking

  const newX = clientX + (Math.random() * randomness * 2) - randomness;
  const newY = clientY + (Math.random() * randomness * 2) - randomness;

  window.Module.canvas.dispatchEvent(
    new MouseEvent( 'mousemove', {
      clientX: newX,
      clientY: newY
    } )
  );
}

})();