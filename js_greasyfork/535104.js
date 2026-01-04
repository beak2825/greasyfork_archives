// ==UserScript==
// @name         MooMoo.io UI Personalizada - Fondo de Cielo Rojo
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Personalización con tus colores (#db2d21 y #0f0f0f) y fondo de cielo rojo
// @author       You
// @match        *://*.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535104/MooMooio%20UI%20Personalizada%20-%20Fondo%20de%20Cielo%20Rojo.user.js
// @updateURL https://update.greasyfork.org/scripts/535104/MooMooio%20UI%20Personalizada%20-%20Fondo%20de%20Cielo%20Rojo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Paleta de colores exacta según tu versión
    const colors = {
        red: '#db2d21',         // Rojo intenso
        darkGray: '#0f0f0f',    // Gris casi negro
        lightRed: '#ff3a2d',    // Variante clara para hover
        textWhite: '#ffffff',   // Texto blanco
        textLight: '#e0e0e0',   // Texto gris claro
        textBlack: '#000000'    // Texto negro
    };

    // URL de tu imagen de fondo personalizada
    const backgroundImageUrl = 'https://i.postimg.cc/0yPP1yx8/there-is-red-sky-with-red-moon-distance-1035769-41355.jpg';

    // Aplicar el fondo personalizado al menú principal
    function applyCustomBackground() {
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu) {
            mainMenu.style.backgroundImage = `url('${backgroundImageUrl}')`;
            mainMenu.style.backgroundSize = 'cover';
            mainMenu.style.backgroundPosition = 'center';
            mainMenu.style.backgroundRepeat = 'no-repeat';
            mainMenu.style.backgroundAttachment = 'fixed';
        }
    }

    // Aplicar estilos principales
    function applyMainStyles() {
        applyCustomBackground(); // Aplicar el fondo primero

        // Bordes superiores rojos para ambas tarjetas
        const setupCard = document.getElementById('setupCard');
        const guideCard = document.getElementById('guideCard');
        
        [setupCard, guideCard].forEach(card => {
            if (card) {
                card.style.borderTop = `5px solid ${colors.red}`;
                card.style.backgroundColor = 'rgba(15, 15, 15, 0.85)'; // Fondo semitransparente
                card.style.color = colors.textWhite;
                card.style.transition = 'transform 0.3s ease';
                card.style.backdropFilter = 'blur(4px)';
                card.style.borderRadius = '8px';
                card.style.overflow = 'hidden';
                
                // Efecto hover para las tarjetas
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'scale(1.02)';
                    card.style.boxShadow = `0 4px 15px ${colors.red}66`;
                });
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'scale(1)';
                    card.style.boxShadow = 'none';
                });
            }
        });

        // Botón Enter Game - Estilo mejorado
        const enterGameBtn = document.getElementById('enterGame');
        if (enterGameBtn) {
            enterGameBtn.style.cssText = `
                background: ${colors.red};
                color: ${colors.textBlack};
                border: none;
                border-radius: 8px;
                padding: 12px 0;
                font-weight: bold;
                transition: all 0.3s ease;
                box-shadow: 0 2px 10px rgba(219, 45, 33, 0.5);
                text-transform: uppercase;
                letter-spacing: 1px;
                font-size: 1.1em;
                margin-top: 15px;
            `;

            // Efectos hover del botón
            enterGameBtn.addEventListener('mouseenter', () => {
                enterGameBtn.style.background = colors.lightRed;
                enterGameBtn.style.transform = 'translateY(-3px)';
                enterGameBtn.style.boxShadow = `0 5px 15px ${colors.red}99`;
            });
            enterGameBtn.addEventListener('mouseleave', () => {
                enterGameBtn.style.background = colors.red;
                enterGameBtn.style.transform = 'translateY(0)';
                enterGameBtn.style.boxShadow = `0 2px 10px rgba(219, 45, 33, 0.5)`;
            });
        }

        // Selector de servidores - Versión profesional
        const serverSelect = document.querySelector('#serverBrowser select');
        if (serverSelect) {
            serverSelect.style.cssText = `
                background: rgba(15, 15, 15, 0.9);
                color: ${colors.textWhite};
                border: 2px solid ${colors.red};
                border-radius: 12px;
                padding: 12px 45px 12px 15px;
                font-size: 14px;
                height: 45px;
                width: 100%;
                appearance: none;
                cursor: pointer;
                transition: all 0.3s ease;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23db2d21' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 15px center;
                margin: 10px 0;
                backdrop-filter: blur(4px);
            `;

            // Efecto hover para el select
            serverSelect.addEventListener('mouseenter', () => {
                serverSelect.style.borderColor = colors.lightRed;
                serverSelect.style.boxShadow = `0 0 0 2px ${colors.red}`;
            });
            serverSelect.addEventListener('mouseleave', () => {
                serverSelect.style.borderColor = colors.red;
                serverSelect.style.boxShadow = 'none';
            });

            // Estilo para las opciones
            const options = document.querySelectorAll('#serverBrowser select option');
            options.forEach(option => {
                option.style.cssText = `
                    background: ${colors.darkGray};
                    color: ${colors.textWhite};
                    padding: 12px;
                    border-bottom: 1px solid #333;
                `;
            });
        }

        // Textos y encabezados
        document.querySelectorAll('.menuHeader').forEach(header => {
            header.style.cssText = `
                color: ${colors.red};
                font-weight: bold;
                text-shadow: 1px 1px 3px rgba(0,0,0,0.7);
                margin: 20px 0 12px;
                font-size: 1.2em;
                letter-spacing: 0.5px;
            `;
        });

        document.querySelectorAll('.menuText').forEach(text => {
            text.style.color = colors.textLight;
            text.style.textShadow = '1px 1px 2px rgba(0,0,0,0.5)';
        });

        // Checkboxes personalizados
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.style.accentColor = colors.red;
            checkbox.style.transform = 'scale(1.2)';
            checkbox.style.marginRight = '8px';
        });

        // Enlaces con efecto
        document.querySelectorAll('a').forEach(link => {
            link.style.cssText = `
                color: ${colors.red};
                transition: all 0.2s ease;
                text-decoration: none;
                font-weight: bold;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            `;
            link.addEventListener('mouseenter', () => {
                link.style.color = colors.lightRed;
                link.style.textDecoration = 'underline';
                link.style.textShadow = `0 0 5px ${colors.red}`;
            });
            link.addEventListener('mouseleave', () => {
                link.style.color = colors.red;
                link.style.textDecoration = 'none';
                link.style.textShadow = '1px 1px 2px rgba(0,0,0,0.5)';
            });
        });
    }

    // Inicialización
    function init() {
        applyMainStyles();
        
        // Añadir estilo dinámico para mejor rendimiento
        const style = document.createElement('style');
        style.textContent = `
            #serverBrowser select option:checked {
                background: ${colors.red} !important;
                color: ${colors.textBlack} !important;
                font-weight: bold;
            }
            .skinColorItem:hover {
                transform: scale(1.15);
                box-shadow: 0 0 8px ${colors.red};
                transition: all 0.2s ease;
            }
            #nameInput {
                background: rgba(15, 15, 15, 0.7);
                color: white;
                border: 2px solid ${colors.red};
                border-radius: 8px;
                padding: 10px;
                font-size: 16px;
                margin-bottom: 15px;
            }
            #nameInput::placeholder {
                color: #aaa;
            }
        `;
        document.head.appendChild(style);
    }

    // Carga inteligente con reintentos para contenido dinámico
    function checkAndInit() {
        if (document.getElementById('mainMenu')) {
            init();
        } else {
            setTimeout(checkAndInit, 200);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAndInit);
    } else {
        checkAndInit();
    }

    // Observador para contenido dinámico
    new MutationObserver(function(mutations) {
        if (document.getElementById('mainMenu')) {
            init();
        }
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
})();