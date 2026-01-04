// ==UserScript==
// @name         Khan é uma merda
// @version      1.0
// @description  Um script para facilitar sua vida fazendo o khan
// @author       GuizeraaXyz
// @match        https://pt.khanacademy.org
// @namespace https://greasyfork.org/users/1372423
// @downloadURL https://update.greasyfork.org/scripts/509972/Khan%20%C3%A9%20uma%20merda.user.js
// @updateURL https://update.greasyfork.org/scripts/509972/Khan%20%C3%A9%20uma%20merda.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function showConfirmationMessage(text, duration = 8000) {
        const messageDiv = document.createElement('div');
        messageDiv.innerHTML = text;

        const blurDiv = document.createElement('div');
        Object.assign(blurDiv.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backdropFilter: 'blur(10px)',
            zIndex: '9999',
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
        });

        Object.assign(messageDiv.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '20px 40px',
            borderRadius: '12px',
            zIndex: '10000',
            fontSize: '26px',
            fontFamily: 'Arial, sans-serif',
            textAlign: 'center',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
            opacity: '1',
            transition: 'opacity 1s, transform 1s',
            backgroundImage: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
            color: 'white',
            border: '5px solid',
            borderColor: 'rgba(0, 170, 255, 1)',
            boxShadow: '0 0 15px rgba(0, 170, 255, 0.7)',
            animation: 'pulseNeon 2s infinite',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        });

        const button = document.createElement('button');
        button.textContent = 'Entendi';
        Object.assign(button.style, {
            marginTop: '20px',
            padding: '10px 20px',
            fontSize: '20px',
            color: 'white',
            backgroundColor: 'rgba(0, 255, 0, 0.9)',
            border: '5px solid',
            borderColor: 'rgba(0, 255, 0, 1)',
            borderRadius: '8px',
            boxShadow: '0 0 15px rgba(0, 255, 0, 0.7)',
            cursor: 'pointer',
            transition: 'transform 0.3s',
            animation: 'pulseGreenNeon 2s infinite'
        });

        button.onmouseover = function() {
            button.style.transform = 'scale(1.1)';
        };

        button.onmouseout = function() {
            button.style.transform = 'scale(1)';
        };

        button.onclick = function() {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translate(-50%, -50%) scale(0.8)';
            blurDiv.style.opacity = '0';

            // Set flag in localStorage to indicate the message has been shown
            localStorage.setItem('scriptNotificationShown', 'true');

            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
                if (blurDiv.parentNode) {
                    blurDiv.parentNode.removeChild(blurDiv);
                }
            }, 1000);
        };

        messageDiv.appendChild(button);

        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = `
            @keyframes pulseNeon {
                0%, 100% {
                    box-shadow: 0 0 15px rgba(0, 170, 255, 0.7);
                }
                50% {
                    box-shadow: 0 0 30px rgba(0, 170, 255, 1);
                }
            }
            @keyframes pulseGreenNeon {
                0%, 100% {
                    box-shadow: 0 0 15px rgba(0, 255, 0, 0.7);
                }
                50% {
                    box-shadow: 0 0 30px rgba(0, 255, 0, 1);
                }
            }
        `;
        document.head.appendChild(styleSheet);

        document.body.appendChild(blurDiv);
        document.body.appendChild(messageDiv);
    }

    function setLanguageToRussian() {
        document.documentElement.lang = 'ru';
        const lang = 'ru';
        const meta = document.createElement('meta');
        meta.name = 'lang';
        meta.content = lang;
        document.head.appendChild(meta);
    }

    // Check if the message has already been shown
    if (!localStorage.getItem('scriptNotificationShown')) {
        setLanguageToRussian();
        showConfirmationMessage(
            'Script Adicionado<br><br><small style="font-size: 18px;">⚠️ Внимание: Код может не работать должным образом в некоторых ситуациях.</small>', 
            8000
        );
    } else {
        setLanguageToRussian();
    }

let e = JSON.parse;
JSON.parse = function (a, t) {
    let n = e(a, t);
    try {
        if (n && n.data && n.data.assessmentItem && n.data.assessmentItem.item && n.data.assessmentItem.item.itemData) {
            n.data.assessmentItem.item.itemData = "{\"answerArea\":{\"calculator\":false,\"chi2Table\":false,\"periodicTable\":false,\"tTable\":false,\"zTable\":false},\"hints\":[{\"content\":\"$\\\\\\\\begin{align}\\\\n\\\\\\\\left(\\\\\\\\dfrac{z^{4}}{6^{2}}\\\\\\\\right)^{-3}&=\\\\\\\\dfrac{\\\\\\\\left(z^{4}\\\\\\\\right)^{-3}}{\\\\\\\\left(6^{2}\\\\\\\\right)^{-3}}\\\\n\\\\\\\\end{align}$\",\"images\":{},\"replace\":false,\"widgets\":{}},{\"content\":\"$\\\\\\\\begin{align}\\\\n\\\\\\\\phantom{\\\\\\\\left(\\\\\\\\dfrac{z^{4}}{6^{2}}\\\\\\\\right)^{-3}}&=\\\\\\\\dfrac{z^{(4)(-3)}}{6^{(2)(-3)}}\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n&=\\\\\\\\dfrac{z^{-12}}{6^{-6}}\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n&=\\\\\\\\dfrac{6^{6}}{z^{12}}\\\\n\\\\\\\\end{align}$\",\"images\":{},\"replace\":false,\"widgets\":{}}],\"itemDataVersion\":{\"major\":0,\"minor\":1},\"question\":{\"content\":\"Khan Academy é uma merda 🤣😂, progamado por GuizeraaXyz[[☃ radio 1]]\",\"images\":{},\"widgets\":{\"radio 1\":{\"alignment\":\"default\",\"graded\":true,\"options\":{\"choices\":[{\"content\":\"RESPOSTA_CERTA \",\"correct\":true},{\"content\":\"RESPOSTA_ERRADA \",\"correct\":false}],\"deselectEnabled\":false,\"displayCount\":null,\"hasNoneOfTheAbove\":false,\"multipleSelect\":false,\"onePerLine\":true,\"randomize\":false},\"static\":false,\"type\":\"radio\",\"version\":{\"major\":1,\"minor\":0}}}}}";
        }
    } catch (r) {
        console.error("Erro module:", r);
    }
    return n;
};
})();