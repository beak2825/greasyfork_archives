// ==UserScript==
// @name         Sketch.js Mouse Effect
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Use sketch.js to show some mouse event effect
// @author       Garry ZHAO
// @match        http://*/*
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdn.staticfile.org/sketch.js/1.1/sketch.js
// @require      https://cdn.staticfile.org/sketch.js/1.1/sketch.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436830/Sketchjs%20Mouse%20Effect.user.js
// @updateURL https://update.greasyfork.org/scripts/436830/Sketchjs%20Mouse%20Effect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Code from here

    function Particle( x, y, radius ) {
        this.init( x, y, radius );
    }

    Particle.prototype = {

        init: function( x, y, radius ) {

            this.alive = true;

            this.radius = radius || 10;
            this.wander = 0.15;
            this.theta = random( TWO_PI );
            this.drag = 0.92;
            this.color = '#fff';

            this.x = x || 0.0;
            this.y = y || 0.0;

            this.vx = 0.0;
            this.vy = 0.0;
        },

        move: function() {

            this.x += this.vx;
            this.y += this.vy;

            this.vx *= this.drag;
            this.vy *= this.drag;

            this.theta += random( -0.5, 0.5 ) * this.wander;
            this.vx += sin( this.theta ) * 0.1;
            this.vy += cos( this.theta ) * 0.1;

            this.radius *= 0.96;
            this.alive = this.radius > 0.5;
        },

        draw: function( ctx ) {

            ctx.beginPath();
            ctx.arc( this.x, this.y, this.radius, 0, TWO_PI );
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    };

    // ----------------------------------------
    // Main
    // ----------------------------------------

    var MAX_PARTICLES = 280;
    var COLOURS = [ '#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423' ];

    var particles = [];
    var pool = [];

    var container = document.createElement('div');
    container.id = "container";
    container.setAttribute("width", screen.availWidth);
    container.setAttribute("height", screen.availHeight);
    container.style.cssText += "position:fixed;";
    container.style.cssText += "z-index:10;";
    container.style.cssText += "pointer-events:none;";
    document.body.prepend(container);

    var demo = Sketch.create({
        container: document.getElementById( 'container' ),
        retina: 'auto'
    });

    var demo_dom = document.getElementsByClassName('sketch')[0]
    demo_dom.style.setProperty('pointer-events', 'none');

    demo.setup = function() {

        // Set off some initial particles.
        var i, x, y;

        for ( i = 0; i < 20; i++ ) {
            x = ( demo.width * 0.5 ) + random( -100, 100 );
            y = ( demo.height * 0.5 ) + random( -100, 100 );
            demo.spawn( x, y );
        }
    };

    demo.spawn = function( x, y ) {

        var particle, theta, force;

        if ( particles.length >= MAX_PARTICLES )
            pool.push( particles.shift() );

        particle = pool.length ? pool.pop() : new Particle();
        particle.init( x, y, random( 5, 40 ) );

        particle.wander = random( 0.5, 2.0 );
        particle.color = random( COLOURS );
        particle.drag = random( 0.9, 0.99 );

        theta = random( TWO_PI );
        force = random( 2, 8 );

        particle.vx = sin( theta ) * force;
        particle.vy = cos( theta ) * force;

        particles.push( particle );
    };

    demo.update = function() {

        var i, particle;

        for ( i = particles.length - 1; i >= 0; i-- ) {

            particle = particles[i];

            if ( particle.alive ) particle.move();
            else pool.push( particles.splice( i, 1 )[0] );
        }
    };

    demo.draw = function() {

        demo.globalCompositeOperation  = 'lighter';

        for ( var i = particles.length - 1; i >= 0; i-- ) {
            particles[i].draw( demo );
        }
    };

    onmousemove = function(event){
        demo.spawn( event.clientX, event.clientY );
    }

    onmousedown = function(event){
        for ( var i = 0; i <50; i++) {
            demo.spawn( event.clientX, event.clientY );
        }
    }


})();