// ==UserScript==
// @name         Discord customizer
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Discord style
// @author       _PeDeCoca
// @match        *://*.discord.com/*
// @license      @Mit
// @downloadURL https://update.greasyfork.org/scripts/524949/Discord%20customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/524949/Discord%20customizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Estilos atualizados
    const customStyle = document.createElement('style');
    customStyle.innerHTML = `
        /* Cores personalizadas */
        :root {
            --background-primary: #350048;
            --background-secondary: #1a0024;
            --background-tertiary: #0d0012;
            --text-normal: #ffffff;
        }

        /* Background simples */
        .app-2rEoOp {
            background: linear-gradient(45deg, #12c2e9, #c471ed, #f64f59);
            background-size: 400% 400%;
            animation: gradientBG 15s ease infinite;
        }

        @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        /* Efeito avatar novo e otimizado */
        .avatar_f9f2ca, .avatar-f9f2ca {
            position: relative !important;
            z-index: 2 !important;
            border-radius: 50% !important;
            overflow: visible !important;
            box-shadow:
                0 0 10px #00ffff,
                0 0 20px #00ffff,
                0 0 30px #00ffff,
                inset 0 0 15px rgba(0, 255, 255, 0.5) !important;
            animation: avatarGlow 3s infinite !important;
        }

        /* Wrapper do avatar */
        .clickable_f9f2ca {
            position: relative !important;
            z-index: 2 !important;
            transform-style: preserve-3d !important;
            transition: transform 0.3s !important;
        }

        /* Efeito de borda gradiente */
        .clickable_f9f2ca::before {
            content: '';
            position: absolute;
            top: -3px;
            left: -3px;
            right: -3px;
            bottom: -3px;
            background: linear-gradient(45deg, #ff00ff, #00ffff);
            border-radius: 50%;
            z-index: -1;
            animation: borderRotate 3s linear infinite;
            opacity: 0.8;
        }

        /* Efeito de brilho */
        .clickable_f9f2ca::after {
            content: '';
            position: absolute;
            inset: -5px;
            background: radial-gradient(circle at center,
                rgba(255,255,255,0.8) 0%,
                rgba(255,255,255,0) 70%);
            border-radius: 50%;
            z-index: -1;
            opacity: 0;
            transition: opacity 0.3s;
        }

        /* Efeitos hover */
        .clickable_f9f2ca:hover {
            transform: scale(1.1) rotate(5deg);
        }

        .clickable_f9f2ca:hover::before {
            animation: borderRotate 1s linear infinite;
        }

        .clickable_f9f2ca:hover::after {
            opacity: 0.5;
        }

        /* Animações */
        @keyframes borderRotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @keyframes pulseGlow {
            0% { filter: drop-shadow(0 0 5px #ff00ff); }
            50% { filter: drop-shadow(0 0 15px #00ffff); }
            100% { filter: drop-shadow(0 0 5px #ff00ff); }
        }

        /* Ajustes do chat */
        .chat-3bRxxu {
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
        }

        /* Container de partículas ajustado */
        #particles-js {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            pointer-events: none;
            opacity: 0.5;
        }

        /* Efeitos épicos para o avatar */
        .avatar_f9f2ca, .avatar-f9f2ca {
            position: relative !important;
            z-index: 2 !important;
            border-radius: 50% !important;
            overflow: visible !important;
            box-shadow:
                0 0 10px #00ffff,
                0 0 20px #00ffff,
                0 0 30px #00ffff,
                inset 0 0 15px rgba(0, 255, 255, 0.5) !important;
            animation: avatarGlow 3s infinite !important;
        }

        /* Container do avatar com matrix effect */
        .clickable_f9f2ca {
            position: relative !important;
            z-index: 2 !important;
            transform-style: preserve-3d !important;
            transition: all 0.3s !important;
        }

        /* Efeito matrix no hover */
        .clickable_f9f2ca::before {
            content: '';
            position: absolute;
            inset: -5px;
            background:
                linear-gradient(90deg,
                    rgba(0, 255, 0, 0.5),
                    rgba(0, 255, 255, 0.5)
                ),
                repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 2px,
                    rgba(0, 255, 0, 0.2) 2px,
                    rgba(0, 255, 0, 0.2) 4px
                );
            border-radius: 50%;
            z-index: -1;
            opacity: 0;
            transition: all 0.3s;
            animation: matrixFlow 20s linear infinite;
        }

        /* Anel de energia */
        .clickable_f9f2ca::after {
            content: '';
            position: absolute;
            inset: -8px;
            border: 2px solid transparent;
            border-radius: 50%;
            background: linear-gradient(45deg, #ff00ff, #00ffff, #00ff00, #ff00ff) border-box;
            -webkit-mask:
                linear-gradient(#fff 0 0) padding-box,
                linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            opacity: 0.8;
            animation: spinRing 3s linear infinite;
        }

        /* Efeitos hover aprimorados */
        .clickable_f9f2ca:hover {
            transform: scale(1.2) rotate(5deg);
        }

        .clickable_f9f2ca:hover::before {
            opacity: 1;
        }

        .clickable_f9f2ca:hover::after {
            inset: -12px;
            opacity: 1;
        }

        /* Nomes com efeito neon */
        .username-2b1r56,
        .username-3_PJ5r,
        .title-338goq {
            color: #00ffff !important;
            text-shadow:
                0 0 5px #00ffff,
                0 0 10px #00ffff,
                0 0 20px #00ffff !important;
            animation: textPulse 2s infinite;
        }

        /* Animações novas */
        @keyframes avatarGlow {
            0%, 100% { filter: brightness(1) hue-rotate(0deg); }
            50% { filter: brightness(1.5) hue-rotate(180deg); }
        }

        @keyframes matrixFlow {
            0% { background-position: 0 0; }
            100% { background-position: 0 1000px; }
        }

        @keyframes spinRing {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @keyframes textPulse {
            0%, 100% { opacity: 1; text-shadow: 0 0 10px #00ffff; }
            50% { opacity: 0.8; text-shadow: 0 0 20px #00ffff; }
        }

        /* Efeito de energia ao clicar */
        .clickable_f9f2ca:active::after {
            animation: energyBurst 0.5s ease-out;
        }

        @keyframes energyBurst {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.5); opacity: 0.5; }
            100% { transform: scale(1); opacity: 0.8; }
        }
    `;

    // Adiciona canvas para Matrix
    function createMatrixBackground() {
        const canvas = document.createElement('canvas');
        canvas.id = 'matrix-bg';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%";
        const fontSize = 10;
        const columns = canvas.width/fontSize;
        const drops = [];

        for(let x = 0; x < columns; x++)
            drops[x] = 1;

        function drawMatrix() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0F0';
            ctx.font = fontSize + 'px monospace';

            for(let i = 0; i < drops.length; i++) {
                const text = matrix[Math.floor(Math.random()*matrix.length)];
                ctx.fillText(text, i*fontSize, drops[i]*fontSize);
                if(drops[i]*fontSize > canvas.height && Math.random() > 0.975)
                    drops[i] = 0;
                drops[i]++;
            }
        }

        setInterval(drawMatrix, 33);
    }

    // Sistema de partículas
    function createParticleSystem() {
        const particlesContainer = document.createElement('div');
        particlesContainer.id = 'particles-js';
        document.body.appendChild(particlesContainer);

        const particles = [];
        const mouse = { x: null, y: null };

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 3 + 1; // Partículas menores
                this.baseX = x;
                this.baseY = y;
                this.density = Math.random() * 30 + 1;
                // Adiciona velocidade própria para movimento autônomo
                this.speedX = (Math.random() * 1 - 0.5) * 0.5; // Velocidade reduzida
                this.speedY = (Math.random() * 1 - 0.5) * 0.5; // Velocidade reduzida
                // Adiciona cor aleatória em tons de azul/roxo
                this.color = `rgba(${114 + Math.random() * 30}, ${137 + Math.random() * 30}, ${218 + Math.random() * 37}, ${0.6 + Math.random() * 0.4})`;
            }

            draw(ctx) {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }

            update() {
                // Movimento autônomo
                this.x += this.speedX;
                this.y += this.speedY;

                // Verificar limites da tela
                if (this.x < 0 || this.x > window.innerWidth) this.speedX *= -1;
                if (this.y < 0 || this.y > window.innerHeight) this.speedY *= -1;

                // Interação com o mouse
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    let force = (100 - distance) / 100;
                    let directionX = forceDirectionX * force * this.density;
                    let directionY = forceDirectionY * force * this.density;
                    this.x -= directionX * 0.5; // Reduzido o efeito do mouse
                    this.y -= directionY * 0.5;
                }

                // Efeito de ondulação suave
                this.x += Math.sin(this.y/50) * 0.3;
                this.y += Math.cos(this.x/50) * 0.3;
            }
        }

        const canvas = document.createElement('canvas');
        canvas.style = 'position: fixed; top: 0; left: 0; pointer-events: none;';
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        function initParticles() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles.length = 0;

            // Reduzido o número de partículas
            for (let i = 0; i < 50; i++) { // Mudado de 150 para 50 partículas
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                particles.push(new Particle(x, y));
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const particle of particles) {
                particle.update();
                particle.draw(ctx);
            }

            // Desenha linhas entre partículas próximas com gradiente
            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        const gradient = ctx.createLinearGradient(
                            particles[i].x, particles[i].y,
                            particles[j].x, particles[j].y
                        );
                        gradient.addColorStop(0, particles[i].color);
                        gradient.addColorStop(1, particles[j].color);

                        ctx.beginPath();
                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        window.addEventListener('resize', initParticles);
        initParticles();
        animate();
    }

    // Função para garantir que os efeitos do avatar sejam aplicados
    function ensureAvatarEffects() {
        const avatarSelectors = [
            '.avatar_f9f2ca',
            '.clickable_f9f2ca',
            '.avatar-f9f2ca'
        ];

        const avatars = document.querySelectorAll(avatarSelectors.join(','));
        avatars.forEach(avatar => {
            if (!avatar.dataset.enhanced) {
                avatar.dataset.enhanced = 'true';

                // Força o reflow do CSS
                requestAnimationFrame(() => {
                    avatar.style.position = 'relative';
                    avatar.style.zIndex = '2';
                    avatar.style.display = 'none';
                    avatar.offsetHeight;
                    avatar.style.display = '';
                });
            }
        });
    }

    // Adiciona observer específico para avatares
    function setupAvatarObserver() {
        const avatarObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    ensureAvatarEffects();
                }
            });
        });

        avatarObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Função de inicialização atualizada
    function applyCustomizations() {
        document.head.appendChild(customStyle);
        createParticleSystem();
        ensureAvatarEffects();
        setupAvatarObserver();

        // Aplicação mais frequente dos efeitos
        setInterval(ensureAvatarEffects, 1000);

        console.log('Discord customizado com efeitos visuais aplicados!');
    }

    // Inicia quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyCustomizations);
    } else {
        applyCustomizations();
    }
})();
