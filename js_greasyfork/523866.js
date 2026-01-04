// ==UserScript==
// @name         Drawaria Weather Game & Climate Effects
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Interactive weather system with mini-games, climate effects, and atmospheric animations for drawaria.online!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/523866/Drawaria%20Weather%20Game%20%20Climate%20Effects.user.js
// @updateURL https://update.greasyfork.org/scripts/523866/Drawaria%20Weather%20Game%20%20Climate%20Effects.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Weather system state
    const weatherState = {
        currentWeather: 'sunny',
        intensity: 50,
        windSpeed: 3,
        temperature: 22,
        gameMode: false,
        score: 0,
        playerX: 0,
        playerY: 0,
        gameElements: [],
        powerUps: [],
        combo: 0,
        gameActive: false
    };

    // Weather particles and effects
    class WeatherParticle {
        constructor(type, x, y) {
            this.type = type;
            this.x = x || Math.random() * window.innerWidth;
            this.y = y || -10;
            this.size = this.getSize();
            this.speed = this.getSpeed();
            this.angle = Math.random() * Math.PI * 2;
            this.opacity = Math.random() * 0.8 + 0.2;
            this.life = 1.0;
            this.color = this.getColor();
            this.vx = (Math.random() - 0.5) * weatherState.windSpeed;
        }

        getSize() {
            switch(this.type) {
                case 'rain': return Math.random() * 3 + 1;
                case 'snow': return Math.random() * 8 + 3;
                case 'lightning': return Math.random() * 200 + 100;
                case 'leaves': return Math.random() * 12 + 8;
                case 'stars': return Math.random() * 3 + 2;
                default: return 5;
            }
        }

        getSpeed() {
            const intensity = weatherState.intensity / 50;
            switch(this.type) {
                case 'rain': return Math.random() * 8 + 5 * intensity;
                case 'snow': return Math.random() * 3 + 1 * intensity;
                case 'lightning': return 0;
                case 'leaves': return Math.random() * 4 + 2 * intensity;
                case 'stars': return Math.random() * 0.5 + 0.2;
                default: return 3;
            }
        }

        getColor() {
            switch(this.type) {
                case 'rain': return `rgba(100, 149, 237, ${this.opacity})`;
                case 'snow': return `rgba(255, 255, 255, ${this.opacity})`;
                case 'lightning': return '#ffffff';
                case 'leaves': return ['#ff6b35', '#f7931e', '#ffd700', '#ff4757'][Math.floor(Math.random() * 4)];
                case 'stars': return '#ffffff';
                default: return '#ffffff';
            }
        }

        update() {
            this.y += this.speed;
            this.x += this.vx;
            
            if (this.type === 'snow') {
                this.x += Math.sin(this.y * 0.01) * 0.5;
            } else if (this.type === 'leaves') {
                this.angle += 0.1;
                this.x += Math.sin(this.angle) * 2;
            } else if (this.type === 'lightning') {
                this.life -= 0.05;
                this.opacity = this.life;
            }

            return this.y < window.innerHeight + 50 && this.x > -50 && this.x < window.innerWidth + 50;
        }

        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.opacity;

            if (this.type === 'rain') {
                ctx.strokeStyle = this.color;
                ctx.lineWidth = this.size;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x - this.vx * 5, this.y - this.speed * 2);
                ctx.stroke();
            } else if (this.type === 'lightning') {
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 3;
                ctx.shadowColor = '#ffffff';
                ctx.shadowBlur = 20;
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const x = this.x + (Math.random() - 0.5) * 100;
                    const y = (window.innerHeight / 5) * i;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            } else {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                
                if (this.type === 'snow') {
                    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
            ctx.restore();
        }
    }

    // Game elements (obstacles and power-ups)
    class GameElement {
        constructor(type, x, y) {
            this.type = type; // 'obstacle', 'powerup', 'coin'
            this.x = x || Math.random() * (window.innerWidth - 60);
            this.y = y || -30;
            this.size = type === 'obstacle' ? 25 : 15;
            this.speed = Math.random() * 4 + 3;
            this.color = this.getColor();
            this.points = this.getPoints();
            this.collected = false;
        }

        getColor() {
            switch(this.type) {
                case 'obstacle': return '#ff4757';
                case 'powerup': return '#2ed573';
                case 'coin': return '#ffa502';
                default: return '#ffffff';
            }
        }

        getPoints() {
            switch(this.type) {
                case 'obstacle': return -10;
                case 'powerup': return 50;
                case 'coin': return 10;
                default: return 0;
            }
        }

        update() {
            this.y += this.speed;
            return this.y < window.innerHeight + 50;
        }

        draw(ctx) {
            ctx.save();
            ctx.fillStyle = this.color;
            
            if (this.type === 'obstacle') {
                // Draw danger triangle
                ctx.beginPath();
                ctx.moveTo(this.x, this.y - this.size);
                ctx.lineTo(this.x - this.size, this.y + this.size);
                ctx.lineTo(this.x + this.size, this.y + this.size);
                ctx.closePath();
                ctx.fill();
                
                ctx.fillStyle = '#ffffff';
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('!', this.x, this.y + 5);
            } else if (this.type === 'powerup') {
                // Draw power-up star
                ctx.beginPath();
                for (let i = 0; i < 10; i++) {
                    const angle = (i * Math.PI) / 5;
                    const radius = i % 2 === 0 ? this.size : this.size / 2;
                    const x = this.x + Math.cos(angle) * radius;
                    const y = this.y + Math.sin(angle) * radius;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.fill();
            } else if (this.type === 'coin') {
                // Draw coin
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#ff6b35';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('$', this.x, this.y + 4);
            }
            ctx.restore();
        }

        checkCollision(playerX, playerY, playerSize) {
            const distance = Math.sqrt(
                Math.pow(this.x - playerX, 2) + Math.pow(this.y - playerY, 2)
            );
            return distance < (this.size + playerSize);
        }
    }

    // Create weather control panel
    function createWeatherPanel() {
        const panel = document.createElement('div');
        panel.innerHTML = `
            <div id="weather-panel" style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: linear-gradient(135deg, #1e3c72, #2a5298);
                border-radius: 20px;
                padding: 20px;
                box-shadow: 0 15px 35px rgba(0,0,0,0.4);
                color: white;
                font-family: 'Segoe UI', sans-serif;
                z-index: 10000;
                min-width: 300px;
                backdrop-filter: blur(15px);
                border: 1px solid rgba(255,255,255,0.1);
            ">
                <h2 style="margin: 0 0 20px 0; text-align: center; color: #87ceeb;">🌤️ Weather Control</h2>
                
                <!-- Current Weather Display -->
                <div style="
                    background: rgba(255,255,255,0.1);
                    border-radius: 12px;
                    padding: 15px;
                    margin-bottom: 20px;
                    text-align: center;
                ">
                    <div id="weather-display" style="font-size: 24px; margin-bottom: 10px;">☀️ Sunny</div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>🌡️ <span id="temp-display">22°C</span></span>
                        <span>💨 <span id="wind-display">3 km/h</span></span>
                        <span>💧 <span id="intensity-display">50%</span></span>
                    </div>
                </div>

                <!-- Weather Controls -->
                <div style="margin: 15px 0;">
                    <label style="display: block; margin-bottom: 5px;">Weather Type:</label>
                    <select id="weather-type" style="
                        width: 100%;
                        padding: 8px;
                        border-radius: 8px;
                        background: rgba(255,255,255,0.2);
                        color: white;
                        border: 1px solid rgba(255,255,255,0.3);
                    ">
                        <option value="sunny">☀️ Sunny</option>
                        <option value="rain">🌧️ Rain</option>
                        <option value="snow">❄️ Snow</option>
                        <option value="storm">⛈️ Storm</option>
                        <option value="autumn">🍂 Autumn</option>
                        <option value="night">🌙 Starry Night</option>
                    </select>
                </div>

                <div style="margin: 15px 0;">
                    <label>Intensity: <span id="intensity-value">50</span>%</label>
                    <input type="range" id="weather-intensity" min="10" max="100" value="50" style="width: 100%;">
                </div>

                <div style="margin: 15px 0;">
                    <label>Wind Speed: <span id="wind-value">3</span> km/h</label>
                    <input type="range" id="wind-speed" min="0" max="15" value="3" style="width: 100%;">
                </div>

                <!-- Game Controls -->
                <div style="
                    background: rgba(46, 213, 115, 0.2);
                    border-radius: 12px;
                    padding: 15px;
                    margin: 20px 0;
                    border: 1px solid rgba(46, 213, 115, 0.3);
                ">
                    <h3 style="margin: 0 0 15px 0; color: #2ed573;">🎮 Weather Dodge Game</h3>
                    <div id="game-stats" style="display: none; margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between;">
                            <span>Score: <span id="game-score">0</span></span>
                            <span>Combo: <span id="game-combo">0</span>x</span>
                        </div>
                    </div>
                    <button id="toggle-game" style="
                        width: 100%;
                        padding: 12px;
                        background: linear-gradient(45deg, #2ed573, #17c0eb);
                        border: none;
                        border-radius: 8px;
                        color: white;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.3s;
                    ">🚀 Start Weather Game</button>
                </div>

                <!-- Quick Weather Presets -->
                <div style="margin: 20px 0 0 0;">
                    <h4 style="margin: 0 0 10px 0; color: #87ceeb;">Quick Presets:</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <button class="weather-preset" data-weather="rain" data-intensity="80">🌧️ Heavy Rain</button>
                        <button class="weather-preset" data-weather="snow" data-intensity="60">❄️ Blizzard</button>
                        <button class="weather-preset" data-weather="storm" data-intensity="90">⛈️ Thunder</button>
                        <button class="weather-preset" data-weather="autumn" data-intensity="40">🍂 Gentle Fall</button>
                    </div>
                </div>
            </div>
        `;

        // Add preset button styles
        const style = document.createElement('style');
        style.textContent = `
            .weather-preset {
                background: rgba(255, 255, 255, 0.15);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: white;
                padding: 8px;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 12px;
            }
            .weather-preset:hover {
                background: rgba(135, 206, 235, 0.3);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(135, 206, 235, 0.2);
            }
            #toggle-game:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(46, 213, 115, 0.3);
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(panel);
        return panel;
    }

    // Main weather system engine
    class WeatherEngine {
        constructor() {
            this.canvas = this.createCanvas();
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.gameElements = [];
            this.lastGameElementSpawn = 0;
            this.setupEventListeners();
            this.animate();
        }

        createCanvas() {
            const canvas = document.createElement('canvas');
            canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                pointer-events: none;
                z-index: 9999;
                background: transparent;
            `;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            document.body.appendChild(canvas);
            return canvas;
        }

        setupEventListeners() {
            // Player movement for game mode
            document.addEventListener('mousemove', (e) => {
                if (weatherState.gameActive) {
                    weatherState.playerX = e.clientX;
                    weatherState.playerY = e.clientY;
                }
            });

            // Resize handler
            window.addEventListener('resize', () => {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
            });
        }

        spawnParticles() {
            const spawnRate = weatherState.intensity / 10;
            
            for (let i = 0; i < spawnRate; i++) {
                let particleType = weatherState.currentWeather;
                
                if (particleType === 'storm') {
                    particleType = Math.random() > 0.7 ? 'lightning' : 'rain';
                }
                
                this.particles.push(new WeatherParticle(particleType));
            }

            // Spawn game elements if in game mode
            if (weatherState.gameActive && Date.now() - this.lastGameElementSpawn > 1000) {
                const random = Math.random();
                let elementType = 'coin';
                
                if (random < 0.3) elementType = 'obstacle';
                else if (random < 0.15) elementType = 'powerup';
                
                this.gameElements.push(new GameElement(elementType));
                this.lastGameElementSpawn = Date.now();
            }
        }

        updateParticles() {
            this.particles = this.particles.filter(particle => particle.update());
        }

        updateGameElements() {
            if (!weatherState.gameActive) {
                this.gameElements = [];
                return;
            }

            this.gameElements = this.gameElements.filter(element => {
                const alive = element.update();
                
                // Check collision with player
                if (!element.collected && element.checkCollision(weatherState.playerX, weatherState.playerY, 20)) {
                    element.collected = true;
                    weatherState.score += element.points;
                    
                    if (element.type === 'coin' || element.type === 'powerup') {
                        weatherState.combo++;
                        weatherState.score += weatherState.combo * 2;
                    } else if (element.type === 'obstacle') {
                        weatherState.combo = 0;
                    }
                    
                    this.updateGameUI();
                    return false;
                }
                
                return alive && !element.collected;
            });
        }

        updateGameUI() {
            document.getElementById('game-score').textContent = weatherState.score;
            document.getElementById('game-combo').textContent = weatherState.combo;
        }

        drawPlayer() {
            if (!weatherState.gameActive) return;

            this.ctx.save();
            this.ctx.fillStyle = '#2ed573';
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(weatherState.playerX, weatherState.playerY, 20, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            
            // Draw player emoji
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('😊', weatherState.playerX, weatherState.playerY + 8);
            this.ctx.restore();
        }

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Apply weather background effects
            this.applyWeatherBackground();
            
            // Spawn and update particles
            this.spawnParticles();
            this.updateParticles();
            this.updateGameElements();

            // Draw everything
            this.particles.forEach(particle => particle.draw(this.ctx));
            this.gameElements.forEach(element => element.draw(this.ctx));
            this.drawPlayer();

            requestAnimationFrame(() => this.animate());
        }

        applyWeatherBackground() {
            if (weatherState.currentWeather === 'storm') {
                // Random lightning flashes
                if (Math.random() < 0.02) {
                    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                }
            } else if (weatherState.currentWeather === 'night') {
                this.ctx.fillStyle = 'rgba(25, 25, 112, 0.1)';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            }
        }

        changeWeather(weather, intensity) {
            weatherState.currentWeather = weather;
            weatherState.intensity = intensity || weatherState.intensity;
            this.updateWeatherDisplay();
        }

        updateWeatherDisplay() {
            const weatherEmojis = {
                sunny: '☀️ Sunny',
                rain: '🌧️ Rainy', 
                snow: '❄️ Snowy',
                storm: '⛈️ Stormy',
                autumn: '🍂 Autumn',
                night: '🌙 Starry Night'
            };
            
            document.getElementById('weather-display').textContent = weatherEmojis[weatherState.currentWeather];
            document.getElementById('temp-display').textContent = `${weatherState.temperature}°C`;
            document.getElementById('wind-display').textContent = `${weatherState.windSpeed} km/h`;
            document.getElementById('intensity-display').textContent = `${weatherState.intensity}%`;
        }
    }

    // Initialize the weather system
    function init() {
        const panel = createWeatherPanel();
        const engine = new WeatherEngine();

        // Weather control event listeners
        document.getElementById('weather-type').onchange = (e) => {
            engine.changeWeather(e.target.value);
        };

        document.getElementById('weather-intensity').oninput = (e) => {
            weatherState.intensity = parseInt(e.target.value);
            document.getElementById('intensity-value').textContent = e.target.value;
            engine.updateWeatherDisplay();
        };

        document.getElementById('wind-speed').oninput = (e) => {
            weatherState.windSpeed = parseInt(e.target.value);
            document.getElementById('wind-value').textContent = e.target.value;
            engine.updateWeatherDisplay();
        };

        // Game toggle
        document.getElementById('toggle-game').onclick = () => {
            weatherState.gameActive = !weatherState.gameActive;
            const button = document.getElementById('toggle-game');
            const stats = document.getElementById('game-stats');
            
            if (weatherState.gameActive) {
                button.textContent = '⏹️ Stop Game';
                button.style.background = 'linear-gradient(45deg, #ff4757, #ff6b35)';
                stats.style.display = 'block';
                weatherState.score = 0;
                weatherState.combo = 0;
                engine.updateGameUI();
            } else {
                button.textContent = '🚀 Start Weather Game';
                button.style.background = 'linear-gradient(45deg, #2ed573, #17c0eb)';
                stats.style.display = 'none';
            }
        };

        // Weather presets
        document.querySelectorAll('.weather-preset').forEach(preset => {
            preset.onclick = () => {
                const weather = preset.dataset.weather;
                const intensity = parseInt(preset.dataset.intensity);
                engine.changeWeather(weather, intensity);
                document.getElementById('weather-type').value = weather;
                document.getElementById('weather-intensity').value = intensity;
                document.getElementById('intensity-value').textContent = intensity;
            };
        });

        // Welcome message
        setTimeout(() => {
            const welcome = document.createElement('div');
            welcome.innerHTML = `
                <div style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    padding: 30px;
                    border-radius: 20px;
                    text-align: center;
                    z-index: 10001;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                    animation: weatherWelcome 5s ease-in-out forwards;
                ">
                    <h2>🌤️ Weather System Activated! 🌤️</h2>
                    <p>🎮 Play the Weather Dodge Game!</p>
                    <p>☔ Control rain, snow, storms & more!</p>
                    <p>⭐ Collect coins and avoid obstacles!</p>
                    <p>🌈 Experience realistic weather effects!</p>
                </div>
            `;

            const welcomeStyle = document.createElement('style');
            welcomeStyle.textContent = `
                @keyframes weatherWelcome {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5) rotate(-10deg); }
                    20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1) rotate(2deg); }
                    30% { transform: translate(-50%, -50%) scale(0.95) rotate(-1deg); }
                    40% { transform: translate(-50%, -50%) scale(1.02) rotate(0.5deg); }
                    50% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
                    80% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(0deg); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8) rotate(0deg); }
                }
            `;
            document.head.appendChild(welcomeStyle);
            document.body.appendChild(welcome);

            setTimeout(() => welcome.remove(), 5000);
        }, 1500);

        console.log('🌦️ Weather System & Game initialized!');
    }

    // Start the weather system when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
