// ==UserScript==
// @name         TeslaCraft Cosmic Profile Redesign 2024
// @namespace    https://teslacraft.org/
// @version      2.2
// @description  Космический редизайн профиля на TeslaCraft
// @match        https://teslacraft.org/members/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500861/TeslaCraft%20Cosmic%20Profile%20Redesign%202024.user.js
// @updateURL https://update.greasyfork.org/scripts/500861/TeslaCraft%20Cosmic%20Profile%20Redesign%202024.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addStyle(css) {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    const mainStyles = `
        body, html {
            margin: 0;
            padding: 0;
            background: url('https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80') no-repeat center center fixed;
            background-size: cover;
            font-family: 'Orbitron', sans-serif;
            color: #00ffff;
            overflow-x: hidden;
        }

        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: -1;
        }

        .profilePage {
            max-width: 1000px;
            margin: 50px auto;
            background: rgba(0, 20, 40, 0.8);
            border-radius: 20px;
            box-shadow: 0 0 50px rgba(0, 255, 255, 0.5);
            overflow: hidden;
            transition: transform 0.3s ease;
            transform: perspective(1000px) rotateX(0deg);
        }

        .mast {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            padding: 30px;
            background: linear-gradient(45deg, rgba(0, 50, 100, 0.8), rgba(0, 100, 200, 0.8));
            border-bottom: 2px solid #00ffff;
        }

        .avatarScaler {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            overflow: hidden;
            border: 3px solid #00ffff;
            box-shadow: 0 0 20px #00ffff;
            position: relative;
        }

        .avatarScaler img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .profile-name {
            flex-grow: 1;
            margin-left: 20px;
        }

        .profile-name h1 {
            font-size: 2.5em;
            margin: 0;
            text-shadow: 0 0 10px #00ffff;
            word-break: break-word;
        }

        .section {
            margin: 30px;
            padding: 20px;
            background: rgba(0, 30, 60, 0.6);
            border-radius: 15px;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
        }

        .subHeading {
            font-size: 1.8em;
            margin-bottom: 20px;
            border-bottom: 2px solid #00ffff;
            padding-bottom: 10px;
        }

        .pairsJustified {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }

        .pairsJustified dl {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0;
            padding: 10px;
            background: rgba(0, 40, 80, 0.6);
            border-radius: 10px;
            transition: all 0.3s ease;
        }

        .pairsJustified dl:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 255, 255, 0.3);
        }

        .pairsJustified dt {
            font-weight: bold;
            color: #00ffff;
        }

        .pairsJustified dd {
            color: #ffffff;
        }

        .tabs {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            margin: 30px 0;
            padding: 0;
        }

        .tabs li {
            list-style: none;
            margin: 10px;
        }

        .tabs a {
            color: #00ffff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 20px;
            transition: all 0.3s ease;
            background: rgba(0, 40, 80, 0.6);
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
        }

        .tabs a:hover, .tabs a.active {
            background: #00ffff;
            color: #000;
        }

        .messageSimple {
            background: rgba(0, 30, 60, 0.6);
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 20px;
            transition: all 0.3s ease;
        }

        .messageSimple:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 255, 255, 0.3);
        }

        .button {
            background: linear-gradient(45deg, #00ffff, #0080ff);
            color: #000;
            border: none;
            padding: 10px 20px;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            font-weight: bold;
        }

        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        }

        ::-webkit-scrollbar {
            width: 10px;
        }

        ::-webkit-scrollbar-track {
            background: rgba(0, 20, 40, 0.8);
        }

        ::-webkit-scrollbar-thumb {
            background: #00ffff;
            border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: #0080ff;
        }

        @media (max-width: 768px) {
            .mast {
                flex-direction: column;
                align-items: center;
                text-align: center;
            }

            .profile-name {
                margin-left: 0;
                margin-top: 10px;
            }

            .profile-name h1 {
                font-size: 2em;
            }

            .avatarScaler {
                width: 100px;
                height: 100px;
                margin-bottom: 20px;
            }

            .section {
                margin: 15px;
                padding: 15px;
            }
        }
    `;

    addStyle(mainStyles);

    function addTabletEffect() {
        const profilePage = document.querySelector('.profilePage');
        let lastScrollTop = 0;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
            const rotateValue = scrollDirection === 'down' ? 5 : -5;

            profilePage.style.transform = `perspective(1000px) rotateX(${rotateValue}deg)`;
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
    }

    function createSpaceParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.id = 'space-particles';
        particlesContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
        `;
        document.body.appendChild(particlesContainer);

        for (let i = 0; i < 100; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: #ffffff;
                border-radius: 50%;
                box-shadow: 0 0 10px #ffffff, 0 0 20px #ffffff, 0 0 30px #ffffff;
                animation: float ${Math.random() * 10 + 5}s linear infinite;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
            `;
            particlesContainer.appendChild(particle);
        }

        const keyframes = `
            @keyframes float {
                0% {
                    transform: translateY(0) translateX(0);
                }
                100% {
                    transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px);
                }
            }
        `;
        addStyle(keyframes);
    }

    addTabletEffect();
    createSpaceParticles();

    function fixWhiteBackgrounds() {
        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
            const style = window.getComputedStyle(el);
            if (style.backgroundColor === 'rgb(255, 255, 255)') {
                el.style.backgroundColor = 'transparent';
            }
        });
    }

    window.addEventListener('load', fixWhiteBackgrounds);

})();
