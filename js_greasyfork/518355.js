// ==UserScript==
// @name         Gartic.io Voice Input
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Gartic.io voice input
// @author       You
// @match        https://*.gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518355/Garticio%20Voice%20Input.user.js
// @updateURL https://update.greasyfork.org/scripts/518355/Garticio%20Voice%20Input.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styles = `
        .voice-container {
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 12px;
            z-index: 9999;
            animation: floatIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            background: rgba(15, 23, 42, 0.85);
            padding: 12px 20px;
            border-radius: 25px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
                        0 4px 8px rgba(31, 41, 55, 0.2),
                        inset 0 2px 5px rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .voice-input {
            width: 300px;
            padding: 10px 18px;
            border: 2px solid rgba(255, 255, 255, 0.08);
            border-radius: 18px;
            font-size: 15px;
            background: rgba(255, 255, 255, 0.03);
            color: #fff;
            letter-spacing: 0.3px;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .voice-input::placeholder {
            color: rgba(255, 255, 255, 0.3);
            font-style: italic;
        }

        .voice-input:focus {
            outline: none;
            border-color: rgba(56, 189, 248, 0.5);
            box-shadow: 0 0 20px rgba(56, 189, 248, 0.15),
                        inset 0 2px 4px rgba(0, 0, 0, 0.1);
            background: rgba(255, 255, 255, 0.05);
            transform: translateY(-1px);
        }

        .mic-button {
            width: 45px;
            height: 45px;
            border: none;
            border-radius: 50%;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3),
                        inset 0 -2px 5px rgba(0, 0, 0, 0.2);
            position: relative;
            overflow: hidden;
        }

        .mic-button::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
            transform: rotate(45deg);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
        }

        .mic-button:hover::before {
            opacity: 1;
            transform: rotate(225deg);
        }

        .mic-button::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            background: linear-gradient(rgba(255, 255, 255, 0.2), transparent);
            clip-path: polygon(0 0, 100% 0, 100% 25%, 0 25%);
            opacity: 0;
            transition: opacity 0.3s;
        }

        .mic-button:hover::after {
            opacity: 1;
        }

        .mic-button:hover {
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
            background: linear-gradient(135deg, #4f46e5, #3b82f6);
        }

        .mic-button:active {
            transform: scale(0.95);
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }

        .mic-button.recording {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            animation: pulseRecord 2s infinite;
        }

        .mic-icon {
            width: 22px;
            height: 22px;
            fill: white;
            filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .recording .mic-icon {
            animation: scaleIcon 2s infinite;
            filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
        }

        .wave-container {
            position: absolute;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }

        .wave {
            position: absolute;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.4);
            animation: wave 2.5s infinite cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
        }

        .recording .wave-container .wave {
            animation: wave 2s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes wave {
            0% {
                width: 0;
                height: 0;
                opacity: 0.8;
                transform: translate(-50%, -50%) rotate(0deg);
            }
            100% {
                width: 200%;
                height: 200%;
                opacity: 0;
                transform: translate(-50%, -50%) rotate(180deg);
            }
        }

        @keyframes pulseRecord {
            0% {
                box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5);
                transform: scale(1);
            }
            50% {
                box-shadow: 0 0 20px 5px rgba(239, 68, 68, 0.3);
                transform: scale(1.02);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
                transform: scale(1);
            }
        }

        @keyframes scaleIcon {
            0%, 100% { 
                transform: scale(1) rotate(0deg); 
                filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
            }
            50% { 
                transform: scale(0.85) rotate(5deg); 
                filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.7));
            }
        }

        @keyframes floatIn {
            0% {
                transform: translate(-50%, -30px);
                opacity: 0;
                filter: blur(10px);
            }
            100% {
                transform: translate(-50%, 0);
                opacity: 1;
                filter: blur(0);
            }
        }

        .visualizer {
            position: absolute;
            bottom: -10px;
            left: 0;
            width: 100%;
            height: 2px;
            display: flex;
            justify-content: space-between;
            padding: 0 5px;
        }

        .visualizer-bar {
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.5);
            transform-origin: bottom;
            transition: all 0.2s ease;
            border-radius: 2px;
            box-shadow: 0 0 4px rgba(255, 255, 255, 0.3);
        }

        .recording .visualizer-bar {
            animation: glow 1.5s infinite;
        }

        @keyframes glow {
            0%, 100% {
                box-shadow: 0 0 4px rgba(255, 255, 255, 0.3);
            }
            50% {
                box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
            }
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    const container = document.createElement('div');
    container.className = 'voice-container';

    const input = document.createElement('input');
    input.className = 'voice-input';
    input.type = 'text';
    input.placeholder = 'Konuşmak için mikrofonu tıklayın...';

    const button = document.createElement('button');
    button.className = 'mic-button';
    button.innerHTML = `
        <div class="wave-container">
            <div class="wave"></div>
            <div class="wave" style="animation-delay: 0.4s"></div>
            <div class="wave" style="animation-delay: 0.8s"></div>
        </div>
        <svg class="mic-icon" viewBox="0 0 24 24">
            <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"/>
        </svg>
        <div class="visualizer">
            ${Array(20).fill().map(() => '<div class="visualizer-bar"></div>').join('')}
        </div>
    `;

    let originalSend = WebSocket.prototype.send;
    let wsObj = null;

    WebSocket.prototype.send = function(data) {
        originalSend.apply(this, arguments);
        if (!wsObj) {
            wsObj = this;
            wsObj.addEventListener("message", (msg) => {
                try {
                    let data = JSON.parse(msg.data.slice(2));
                    if (data[0] == 5) {
                        wsObj.lengthID = data[1];
                        wsObj.id = data[2];
                        wsObj.roomCode = data[3];
                    }
                } catch (err) {}
            });
        }
    };

    const sendMessage = (message) => {
        if (wsObj && message.trim()) {
            wsObj.send(`42[11,${wsObj.id},"${message}"]`);
        }
    };

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'tr-TR';
    recognition.continuous = true;
    recognition.interimResults = true;

    let isRecording = false;

    button.addEventListener('click', () => {
        if (!isRecording) {
            recognition.start();
            button.classList.add('recording');
            animateVisualizer(true);
        } else {
            recognition.stop();
            button.classList.remove('recording');
            animateVisualizer(false);
        }
        isRecording = !isRecording;
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage(input.value);
            input.value = '';
        }
    });

    recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
        
        input.value = transcript;
    };

    recognition.onend = () => {
        button.classList.remove('recording');
        isRecording = false;
        animateVisualizer(false);
    };

    function animateVisualizer(active) {
        const bars = document.querySelectorAll('.visualizer-bar');
        if (active) {
            bars.forEach(bar => {
                const animate = () => {
                    const height = Math.random() * 20 + 2;
                    bar.style.height = `${height}px`;
                    bar.style.transform = `scaleY(${height/2})`;
                    if (isRecording) {
                        requestAnimationFrame(animate);
                    }
                };
                animate();
            });
        } else {
            bars.forEach(bar => {
                bar.style.height = '2px';
                bar.style.transform = 'scaleY(1)';
            });
        }
    }

    container.appendChild(input);
    container.appendChild(button);
    document.body.appendChild(container);
})();