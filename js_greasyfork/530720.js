// ==UserScript==
// @name         Tank Trouble Remake
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Tank Trouble game remake
// @author       Psykos
// @match        https://tanktrouble.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530720/Tank%20Trouble%20Remake.user.js
// @updateURL https://update.greasyfork.org/scripts/530720/Tank%20Trouble%20Remake.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Vector2D class
    class Vector2D {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }
        
        add(v) {
            return new Vector2D(this.x + v.x, this.y + v.y);
        }
        
        multiply(scalar) {
            return new Vector2D(this.x * scalar, this.y * scalar);
        }
    }

    // Entity class
    class Entity {
        constructor(position) {
            this.position = position;
            this.velocity = new Vector2D();
        }
        
        update(deltaTime) {
            this.position = this.position.add(this.velocity.multiply(deltaTime));
        }
        
        draw(ctx) {}
    }

    // Tank class
    class Tank extends Entity {
        constructor(x, y) {
            super(new Vector2D(x, y));
            this.direction = 0;
            this.speed = 100;
        }
        
        rotate(amount) {
            this.direction += amount * Math.PI / 180;
        }
        
        fire() {
            return new Bullet(
                this.position.x,
                this.position.y,
                this.direction
            );
        }
        
        draw(ctx) {
            ctx.save();
            ctx.translate(this.position.x, this.position.y);
            ctx.rotate(this.direction);
            
            // Draw tank body
            ctx.fillStyle = 'blue';
            ctx.fillRect(-20, -15, 40, 30);
            
            // Draw turret
            ctx.fillStyle = 'gray';
            ctx.fillRect(-10, -10, 20, 20);
            
            ctx.restore();
        }
    }

    // Bullet class
    class Bullet extends Entity {
        constructor(x, y, direction) {
            super(new Vector2D(x, y));
            this.velocity = new Vector2D(
                Math.cos(direction) * 500,
                Math.sin(direction) * 500
            );
        }
        
        draw(ctx) {
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        isOffScreen(canvas) {
            return (
                this.position.x < 0 ||
                this.position.x > canvas.width ||
                this.position.y < 0 ||
                this.position.y > canvas.height
            );
        }
    }

    // Game class
    class Game {
        constructor() {
            this.canvas = document.createElement('canvas');
            this.canvas.width = 800;
            this.canvas.height = 600;
            this.ctx = this.canvas.getContext('2d');
            
            document.body.appendChild(this.canvas);
            
            this.tanks = [new Tank(400, 300)];
            this.bullets = [];
            
            this.setupControls();
            this.gameLoop();
        }
        
        setupControls() {
            document.addEventListener('keydown', (event) => {
                const tank = this.tanks[0];
                switch(event.key) {
                    case 'ArrowLeft':
                        tank.rotate(-5);
                        break;
                    case 'ArrowRight':
                        tank.rotate(5);
                        break;
                    case ' ':
                        this.bullets.push(tank.fire());
                        break;
                }
            });
        }
        
        gameLoop() {
            const deltaTime = 1/60;
            
            this.update(deltaTime);
            this.render();
            
            requestAnimationFrame(() => this.gameLoop());
        }
        
        update(deltaTime) {
            this.tanks.forEach(tank => tank.update(deltaTime));
            this.bullets.forEach(bullet => bullet.update(deltaTime));
            this.bullets = this.bullets.filter(bullet => !bullet.isOffScreen(this.canvas));
        }
        
        render() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.tanks.forEach(tank => tank.draw(this.ctx));
            this.bullets.forEach(bullet => bullet.draw(this.ctx));
        }
    }

    // Start the game
    new Game();
})();